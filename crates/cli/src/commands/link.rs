use crate::{
    commands::deploy::{ApplicationsResponse, OrganizationsResponse},
    utils::{get_root, get_theme, ApiClient, ApplicationConfig, Config},
};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Select};
use std::path::PathBuf;

pub async fn link(config: &Config, directory: Option<PathBuf>) -> Result<()> {
    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let root = get_root(directory);
    let application_config = ApplicationConfig::load(&root, None, None)?;

    match !application_config.application_id.is_empty() {
        true => Err(anyhow!(
            "This directory is already linked to an application"
        )),
        false => {
            let client = ApiClient::new(config.clone());

            let organizations = client
                .get::<OrganizationsResponse>("/api/organizations")
                .await?;

            let index = Select::with_theme(get_theme())
                .items(&organizations)
                .default(0)
                .with_prompt("Which Organization would you like to link from?")
                .interact()?;
            let organization = &organizations[index];

            let applications = client
                .get::<ApplicationsResponse>(&format!(
                    "/api/organizations/{}/projects",
                    organization.id
                ))
                .await?;

            let index = Select::with_theme(get_theme())
                .items(&applications)
                .default(0)
                .with_prompt("Which application would you like to link?")
                .interact()?;
            let application = &applications[index];

            let mut application_config = ApplicationConfig::load(&root, None, None)?;
            application_config
                .application_id
                .clone_from(&application.id);
            application_config.write(&root)?;

            println!();
            println!(" {} Application linked!", style("◼").magenta());

            Ok(())
        }
    }
}
