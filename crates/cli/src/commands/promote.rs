use crate::utils::{get_root, get_theme, print_progress, ApiClient, Config, FunctionConfig};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm};
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
struct PromoteDeploymentResponse {
    #[allow(dead_code)]
    ok: bool,
}

pub async fn promote(deployment_id: String, directory: Option<PathBuf>) -> Result<()> {
    let config = Config::new()?;

    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let root = get_root(directory);
    let project_config = FunctionConfig::load(&root, None, None)?;

    if project_config.function_id.is_empty() {
        return Err(anyhow!(
            "This directory is not linked to a project. Please link it with `lagoss link`"
        ));
    }

    match Confirm::with_theme(get_theme())
        .with_prompt("Do you really want to promote this Deployment to production?")
        .default(true)
        .interact()?
    {
        true => {
            println!();
            let end_progress = print_progress("Promoting Deployment");
            let res = ApiClient::new(config)
                .post::<(), PromoteDeploymentResponse>(
                    &format!(
                        "/api/projects/{}/deployments/{}/promote",
                        project_config.function_id, deployment_id
                    ),
                    (),
                )
                .await?;
            end_progress();
            if !res.ok {
                return Err(anyhow!("Failed to promote deployment"));
            }

            println!();
            println!(
                " {} Deployment promoted to production!",
                style("◼").magenta()
            );

            Ok(())
        }
        false => {
            println!();
            println!("{} Promotion aborted", style("✕").red());
            Ok(())
        }
    }
}
