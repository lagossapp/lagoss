use crate::utils::{get_root, print_progress, Config, FunctionConfig, ApiClient};
use anyhow::{anyhow, Result};
use dialoguer::console::style;
use serde::Deserialize;
use std::path::PathBuf;

type DeploymentsResponse = Vec<Deployment>;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Deployment {
    id: String,
    created_at: String,
    is_production: bool,
}

pub async fn ls(directory: Option<PathBuf>) -> Result<()> {
    let config = Config::new()?;

    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let root = get_root(directory);
    let project_config = FunctionConfig::load(&root, None, None)?;
    let end_progress = print_progress("Fetching Deployments");

    let deployments = ApiClient::new(config)
        .get::<DeploymentsResponse>(&format!(
            "/api/projects/{}/deployments",
            project_config.function_id
        ))
        .await?;

    end_progress();
    println!();
    println!(" {} List of Deployments:", style("◼").magenta());
    println!();

    if deployments.is_empty() {
        println!("{} No deployments found", style("✕").red());
    } else {
        for deployment in deployments {
            if deployment.is_production {
                println!(
                    "{} Production: {} {}",
                    style("●").black().bright(),
                    style(format!("https://{}.lagoss.com", deployment.id))
                        .blue()
                        .underlined(),
                    style(format!("({})", deployment.created_at))
                        .black()
                        .bright(),
                );
            } else {
                println!(
                    "{} Preview: {} {}",
                    style("○").black().bright(),
                    style(format!("https://{}.lagoss.com", deployment.id))
                        .blue()
                        .underlined(),
                    style(format!("({})", deployment.created_at))
                        .black()
                        .bright(),
                );
            }
        }
    }

    Ok(())
}
