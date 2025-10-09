use crate::utils::{get_root, get_theme, print_progress, ApiClient, ApplicationConfig, Config};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm};
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
struct UndeployDeploymentResponse {
    #[allow(dead_code)]
    ok: bool,
}

pub async fn undeploy(
    config: &Config,
    deployment_id: String,
    directory: Option<PathBuf>,
) -> Result<()> {
    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let root = get_root(directory);
    let application_config = ApplicationConfig::load(&root, None, None)?;

    if application_config.application_id.is_empty() {
        return Err(anyhow!(
            "This directory is not linked to an application. Please link it with `lagoss link`"
        ));
    }

    match Confirm::with_theme(get_theme())
        .with_prompt("Do you really want to delete this deployment?")
        .default(false)
        .interact()?
    {
        true => {
            let end_progress = print_progress("Deleting deployment");
            let client = ApiClient::new(config.clone());

            client
                .delete::<UndeployDeploymentResponse>(&format!(
                    "/api/projects/{}/deployments/{}",
                    application_config.application_id, deployment_id
                ))
                .await?;
            end_progress();

            println!();
            println!(" {} Deployment deleted!", style("◼").magenta());

            Ok(())
        }
        false => {
            println!();
            println!("{} Deletion aborted", style("✕").red());
            Ok(())
        }
    }
}
