use crate::get_region;
use anyhow::{anyhow, Result};
use dashmap::DashMap;
use futures::{stream::FuturesUnordered, StreamExt};
use lagoss_runtime_utils::{Deployment, DEPLOYMENTS_DIR};
use lagoss_serverless_downloader::Downloader;
use log::{error, info, warn};
use serde::Deserialize;
use std::{
    collections::{HashMap, HashSet},
    fs,
    path::Path,
    sync::Arc,
};

use self::filesystem::{create_deployments_folder, rm_deployment};

pub mod cache;
pub mod filesystem;
pub mod pubsub;

pub type Deployments = Arc<DashMap<String, Arc<Deployment>>>;

pub async fn download_deployment<D>(deployment: &Deployment, downloader: Arc<D>) -> Result<()>
where
    D: Downloader,
{
    let path = format!("{}.js", deployment.id);

    match downloader.download(&path).await {
        Ok(object) => {
            deployment.write_code(&object)?;
            info!(deployment = deployment.id; "Wrote deployment");

            if !deployment.assets.is_empty() {
                let mut futures = FuturesUnordered::new();

                for asset in &deployment.assets {
                    futures.push(async {
                        let path = format!("{}/{}", deployment.id, asset.clone());
                        let future = downloader.download(&path);

                        (future.await, asset.clone())
                    });
                }

                while let Some((result, asset)) = futures.next().await {
                    match result {
                        Ok(object) => {
                            deployment.write_asset(&asset, &object)?;
                        }
                        Err(error) => {
                            warn!(deployment = deployment.id, asset = asset; "Failed to download deployment asset: {}", error)
                        }
                    };
                }
            }

            Ok(())
        }
        Err(error) => Err(anyhow!(error)),
    }
}

#[derive(Deserialize)]
struct AssetObj(Vec<String>);

// {
//     id: string,
//     isProduction: boolean,
//     assets: string[],
//     function: {
//     id: string,
//     name: string,
//     memory: number,
//     tickTimeout: number,
//     totalTimeout: number,
//     cron: string,
//     },
//     domains: string[],
//     env: {key: string, value: string}[],
// }

#[derive(Deserialize)]
struct DeploymentData {
    id: String,

    #[serde(rename = "functionId")]
    function_id: String,

    #[serde(rename = "functionName")]
    function_name: String,

    domains: HashSet<String>,
    assets: HashSet<String>,
    memory: usize, // in MB (MegaBytes)

    #[serde(rename = "env")]
    environment_variables: HashMap<String, String>,

    #[serde(rename = "tickTimeout")]
    tick_timeout: usize, // in ms (MilliSeconds)

    #[serde(rename = "totalTimeout")]
    total_timeout: usize, // in ms (MilliSeconds)

    #[serde(rename = "isProduction")]
    is_production: bool,

    cron: Option<String>,
}

pub async fn get_deployments<D>(
    api_url: String,
    api_token: String,
    downloader: Arc<D>,
) -> Result<Deployments>
where
    D: Downloader,
{
    let deployments = Arc::new(DashMap::new());
    let mut deployments_list: HashMap<String, Deployment> = HashMap::new();

    let url: String = format!("{}/api/serverless/deployments", api_url);
    let client = reqwest::Client::new();
    let deployments_response = client
        .get(&url)
        .header("Authorization", format!("Bearer {}", api_token))
        .header("lagoss-region", get_region())
        .send()
        .await?
        .json::<Vec<DeploymentData>>()
        .await?;

    deployments_response.into_iter().for_each(
        |DeploymentData {
             id,
             function_id,
             function_name,
             domains,
             assets,
             environment_variables,
             memory,
             tick_timeout,
             total_timeout,
             is_production,
             cron,
         }| {
            deployments_list.entry(id.clone()).or_insert(Deployment {
                id,
                function_id,
                function_name,
                domains: HashSet::from_iter(domains.iter().cloned()),
                assets: HashSet::from_iter(assets.iter().cloned()),
                environment_variables: environment_variables.clone(),
                memory,
                tick_timeout,
                total_timeout,
                is_production,
                cron,
            });
        },
    );

    let deployments_list: Vec<Deployment> = deployments_list.values().cloned().collect();

    info!("Found {} deployment(s) to deploy", deployments_list.len());

    if let Err(error) = create_deployments_folder() {
        error!("Could not create deployments folder: {}", error);
    }

    if let Err(error) = delete_old_deployments(&deployments_list).await {
        error!("Failed to delete old deployments: {:?}", error);
    }

    futures::future::join_all(deployments_list.into_iter().map(|deployment| async {
        if !deployment.has_code() {
            if let Err(error) = download_deployment(&deployment, Arc::clone(&downloader)).await {
                error!("Failed to download deployment {}: {}", deployment.id, error);
                return;
            }
        }

        let deployment = Arc::new(deployment);

        for domain in deployment.get_domains() {
            deployments.insert(domain, Arc::clone(&deployment));
        }
    }))
    .await;

    Ok(deployments)
}

async fn delete_old_deployments(deployments: &[Deployment]) -> Result<()> {
    info!("Deleting old deployments");
    let local_deployments_files = fs::read_dir(Path::new(DEPLOYMENTS_DIR))?;

    for local_deployment_file in local_deployments_files {
        let local_deployment_file_name = local_deployment_file?
            .file_name()
            .into_string()
            .unwrap_or_else(|_| "".into());

        // Skip folders
        if !local_deployment_file_name.ends_with(".js") {
            continue;
        }

        let local_deployment_id = local_deployment_file_name.replace(".js", "");

        if !deployments
            .iter()
            .any(|deployment| deployment.id == local_deployment_id)
        {
            rm_deployment(&local_deployment_id)?;
        }
    }
    info!("Old deployments deleted");

    Ok(())
}
