use crate::utils::{get_root, get_theme, print_progress, ApiClient, ApplicationConfig, Config};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm};
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
struct DeleteApplicationResponse {
    #[allow(dead_code)]
    ok: bool,
}

pub async fn rm(config: Config, directory: Option<PathBuf>) -> Result<()> {
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
        .with_prompt(
            "Do you really want to completely delete this application, its deployments, statistics and logs?",
        )
        .default(false)
        .interact()?
    {
        true => {
            let end_progress = print_progress("Deleting application");
            let res = ApiClient::new(config)
                .delete::<DeleteApplicationResponse>(
                &format!(
                        "/api/projects/{}",
                        application_config.application_id,
                    ),
                )
                .await?;
            end_progress();
            if !res.ok {
                return Err(anyhow!("Failed to delete application"));
            }

            application_config.delete(&root)?;

            println!();
            println!(" {} Application deleted!", style("◼").magenta());

            Ok(())
        }
        false => {
            println!();
            println!("{} Deletion aborted", style("✕").red());
            Ok(())
        },
    }
}
