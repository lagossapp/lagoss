use super::{Config, MAX_ASSET_SIZE_MB, MAX_FUNCTION_SIZE_MB};
use crate::utils::{get_pretty_path, print_progress, ApiClient, ApplicationConfig};
use anyhow::{anyhow, Result};
use dialoguer::console::style;
use pathdiff::diff_paths;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::{collections::HashMap, fs, io::ErrorKind, path::Path, process::Command};
use walkdir::{DirEntry, WalkDir};

pub type Assets = HashMap<String, Vec<u8>>;

#[cfg(windows)]
const ESBUILD: &str = "esbuild.cmd";

#[cfg(not(windows))]
const ESBUILD: &str = "esbuild";

fn esbuild(file: &Path, root: &Path, prod: bool) -> Result<Vec<u8>> {
    let node_env = match prod {
        true => "production",
        false => "development",
    };

    let result = Command::new(ESBUILD)
        .arg(root.join(file))
        .arg(format!("--define:process.env.NODE_ENV=\"{}\"", node_env))
        .arg("--bundle")
        .arg("--format=esm")
        .arg("--target=esnext")
        .arg("--platform=browser")
        .arg("--conditions=lagoss,worker")
        .arg("--loader:.wasm=binary")
        .output()?;

    // TODO: check status code
    if result.status.success() {
        let output = result.stdout;

        if output.len() >= MAX_FUNCTION_SIZE_MB {
            return Err(anyhow!(
                "Function can't be larger than {} bytes",
                MAX_FUNCTION_SIZE_MB
            ));
        }

        return Ok(output);
    }

    Err(anyhow!(
        "Unexpected status code {}:\n\n{}",
        result.status.code().unwrap_or(0),
        String::from_utf8(result.stderr).unwrap_or_else(|_| "Unknown error.".to_string())
    ))
}

pub fn bundle_application(
    application_config: &ApplicationConfig,
    prod: bool,
) -> Result<(Vec<u8>, Assets)> {
    let root = application_config.path.as_path();

    if let Err(error) = Command::new(ESBUILD).arg("--version").output() {
        return if error.kind() == ErrorKind::NotFound {
            Err(anyhow!(
                "Could not find ESBuild. Please install it with `npm install -g esbuild`",
            ))
        } else {
            Err(anyhow!(
                "An error occurred while running ESBuild: {:?}",
                error
            ))
        };
    }

    let index_output = match &application_config.handler {
        Some(handler) => {
            let end_progress = print_progress("Bundling handler ...");
            let output = esbuild(handler, root, prod)?;
            end_progress();
            output
        }

        None => {
            println!(
                "{}",
                style("Using static site handler as no handler was provided.")
                    .black()
                    .bright()
            );
            // TODO: improve static site handler
            // if no handler is provided, we create a default one that redirects to /404.html
            Vec::from(str::trim(
                "
export function handler(request) {
console.log('Handling request for', request.url);
  if (new URL(request.url).pathname === '/404.html') {
    return new Response('not found', { status: 404 });
  }

  return new Response('', {
    status: 302,
    headers: {
      location: '/404.html',
    },
  });
}
",
            ))
        }
    };

    let mut final_assets = Assets::new();

    // // TODO: do we actually need this client bundle?
    // if let Some(client) = &application_config.client {
    //     let end_progress = print_progress("Bundling client file");
    //     let client_output = esbuild(client, root, prod)?;
    //     end_progress();

    //     let client_path = client.as_path().with_extension("js");
    //     let client_path = client_path.file_name().unwrap();

    //     if let Some(assets) = &application_config.assets {
    //         let client_path = assets.join(client_path);
    //         fs::write(client_path, &client_output)?;
    //     }

    //     final_assets.insert(
    //         client
    //             .as_path()
    //             .file_stem()
    //             .unwrap()
    //             .to_str()
    //             .unwrap()
    //             .replace('\\', "/")
    //             + ".js",
    //         client_output,
    //     );
    // }

    if let Some(assets) = &application_config.assets {
        let assets = root.join(assets);
        let msg = format!(
            "Processing assets {}",
            get_pretty_path(root, application_config.assets.clone().unwrap().as_path()),
        );
        let end_progress = print_progress(&msg);

        let files = WalkDir::new(&assets)
            .into_iter()
            .collect::<Vec<walkdir::Result<DirEntry>>>();

        for file in files {
            let file = file?;
            let path = file.path();

            if path.is_file() {
                if path.metadata()?.len() >= MAX_ASSET_SIZE_MB {
                    return Err(anyhow!(
                        "File {:?} can't be larger than {} bytes",
                        path,
                        MAX_ASSET_SIZE_MB
                    ));
                }

                let diff = diff_paths(path, &assets)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .replace('\\', "/");
                let file_content = fs::read(path)?;

                final_assets.insert(diff, file_content);
            }
        }

        end_progress();
    } else {
        println!("{}", style("Skipping assets ...").black().bright());
    }

    Ok((index_output, final_assets))
}

#[derive(Serialize, Debug)]
struct Asset {
    name: String,
    size: usize,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct CreateDeploymentRequest {
    function_size: usize,
    assets: Vec<Asset>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct CreateDeploymentResponse {
    deployment_id: String,
    code_url: String,
    assets_urls: HashMap<String, String>,
}

#[derive(Deserialize, Debug)]
struct GetDeploymentResponse {
    urls: Vec<String>,
}

#[derive(Deserialize, Debug)]
struct PromoteDeploymentResponse {
    ok: bool,
}

pub async fn create_deployment(
    config: &Config,
    application_config: &ApplicationConfig,
    is_production: bool,
    prod_bundle: bool,
) -> Result<()> {
    let (index, assets) = bundle_application(application_config, prod_bundle)?;

    let end_progress = print_progress("Creating deployment");

    let client = ApiClient::new(config.clone());

    let client = Arc::new(client);

    let CreateDeploymentResponse {
        deployment_id,
        code_url,
        assets_urls,
    } = client
        .post::<CreateDeploymentRequest, CreateDeploymentResponse>(
            &format!(
                "/api/projects/{}/deployments",
                application_config.application_id
            ),
            CreateDeploymentRequest {
                function_size: index.len(),
                assets: assets
                    .iter()
                    .map(|(key, value)| Asset {
                        name: key.clone(),
                        size: value.len(),
                    })
                    .collect(),
            },
        )
        .await?;

    end_progress();

    let uploaded_assets_msg = format!("Uploading handler and {} assets", assets.len());
    let end_progress = print_progress(&uploaded_assets_msg);

    upload_s3_file(Arc::clone(&client), index, code_url).await?;

    let mut join_set = tokio::task::JoinSet::new();
    for (asset, url) in assets_urls {
        let asset = assets
            .get(&asset)
            .unwrap_or_else(|| panic!("Couldn't find asset {asset}"));

        join_set.spawn(upload_s3_file(Arc::clone(&client), asset.clone(), url));
    }

    while let Some(res) = join_set.join_next().await {
        res?.expect("Couldn't upload asset");
    }

    end_progress();

    if is_production {
        let end_progress = print_progress("Promoting deployment to production");

        let response = client
            .post::<(), PromoteDeploymentResponse>(
                &format!(
                    "/api/projects/{}/deployments/{}/promote",
                    application_config.application_id, deployment_id
                ),
                (),
            )
            .await?;

        if !response.ok {
            return Err(anyhow!("Couldn't promote deployment to production"));
        }

        end_progress();
    }

    let deployment = client
        .get::<GetDeploymentResponse>(&format!(
            "/api/projects/{}/deployments/{}",
            application_config.application_id, deployment_id
        ))
        .await?;

    println!();
    println!(
        " {} Application successfully deployed!",
        style("◼").magenta()
    );

    if !is_production {
        println!(
            "   {}",
            style("Append --prod to deploy to production")
                .black()
                .bright(),
        );
    }

    println!();
    deployment.urls.iter().for_each(|domain| {
        println!(
            "   {} {}",
            style("›").black().bright(),
            style(domain).blue().underlined()
        );
    });

    Ok(())
}

async fn upload_s3_file(client: Arc<ApiClient>, asset: Vec<u8>, url: String) -> Result<()> {
    let response = client
        .client
        .request("PUT".parse()?, url)
        .body(asset)
        .send()
        .await?;

    if !response.status().is_success() {
        let error_code = response.status();
        let error_message = response.text().await?;

        println!(
            "Failed to upload file to s3: {}\n{}\n",
            error_code, error_message
        );

        return Err(anyhow!("Failed to upload file to s3: {}", error_code));
    }

    Ok(())
}
