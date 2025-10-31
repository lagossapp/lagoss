use crate::utils::{
    get_theme, lookup_application_id, print_progress, ApiClient, ApplicationConfig, Config,
};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm};
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
struct DeleteApplicationResponse {
    #[allow(dead_code)]
    ok: bool,
}

pub async fn rm(
    config: &Config,
    directory: Option<PathBuf>,
    app_id_or_name: Option<String>,
) -> Result<()> {
    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let app_id = lookup_application_id(config, app_id_or_name).await?;

    let application_config = ApplicationConfig::load(directory, None, app_id)?;

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
            let res = ApiClient::new(config.clone())
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

            application_config.delete()?;

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
