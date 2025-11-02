use crate::utils::{
    get_theme, lookup_application_id, print_progress, ApiClient, ApplicationConfig, Config,
};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm};
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
struct PromoteDeploymentResponse {
    #[allow(dead_code)]
    ok: bool,
}

pub async fn promote(
    config: &Config,
    deployment_id: String,
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
        .with_prompt("Do you really want to promote this deployment to production?")
        .default(true)
        .interact()?
    {
        true => {
            println!();
            let end_progress = print_progress("Promoting deployment");
            let res = ApiClient::new(config.clone())
                .post::<(), PromoteDeploymentResponse>(
                    &format!(
                        "/api/apps/{}/deployments/{}/promote",
                        application_config.application_id, deployment_id
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
