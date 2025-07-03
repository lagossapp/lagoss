use crate::utils::{get_root, get_theme, print_progress, ApiClient, Config, FunctionConfig};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm};
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
struct DeleteProjectResponse {
    #[allow(dead_code)]
    ok: bool,
}

pub async fn rm(directory: Option<PathBuf>) -> Result<()> {
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
        .with_prompt(
            "Do you really want to completely delete this project, its deployments, statistics and logs?",
        )
        .default(false)
        .interact()?
    {
        true => {
            let end_progress = print_progress("Deleting project");
            let res = ApiClient::new(config)
                .delete::<DeleteProjectResponse>(
                &format!(
                        "/api/projects/{}/deployments",
                        project_config.function_id,
                    ),
                )
                .await?;
            end_progress();
            if !res.ok {
                return Err(anyhow!("Failed to delete project"));
            }

            project_config.delete(&root)?;

            println!();
            println!(" {} Project deleted!", style("◼").magenta());

            Ok(())
        }
        false => {
            println!();
            println!("{} Project aborted", style("✕").red());
            Ok(())
        },
    }
}
