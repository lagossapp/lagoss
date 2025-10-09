use crate::utils::{get_root, print_progress, ApiClient, ApplicationConfig, Config};
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

pub async fn ls(config: &Config, directory: Option<PathBuf>) -> Result<()> {
    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let root = get_root(directory);
    let application_config = ApplicationConfig::load(&root, None, None)?;
    let end_progress = print_progress("Fetching Deployments");

    if application_config.application_id.is_empty() {
        return Err(anyhow!(
            "This directory is not linked to an application. Please link it with `lagoss link`"
        ));
    }

    let deployments = ApiClient::new(config.clone())
        .get::<DeploymentsResponse>(&format!(
            "/api/projects/{}/deployments",
            application_config.application_id
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
