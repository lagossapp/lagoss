use crate::{
    commands::deploy::{OrganizationsResponse, ProjectsResponse},
    utils::{get_root, get_theme, ApiClient, Config, FunctionConfig},
};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Select};
use std::path::PathBuf;

pub async fn link(directory: Option<PathBuf>) -> Result<()> {
    let config = Config::new()?;

    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let root = get_root(directory);
    let project_config = FunctionConfig::load(&root, None, None)?;

    match !project_config.function_id.is_empty() {
        true => Err(anyhow!("This directory is already linked to a project")),
        false => {
            let client = ApiClient::new(config);

            let organizations = client
                .get::<OrganizationsResponse>("/api/organizations")
                .await?;

            let index = Select::with_theme(get_theme())
                .items(&organizations)
                .default(0)
                .with_prompt("Which Organization would you like to link from?")
                .interact()?;
            let organization = &organizations[index];

            let projects = client
                .get::<ProjectsResponse>(&format!(
                    "/api/organizations/{}/projects",
                    organization.id
                ))
                .await?;

            let index = Select::with_theme(get_theme())
                .items(&projects)
                .default(0)
                .with_prompt("Which project would you like to link?")
                .interact()?;
            let project = &projects[index];

            let mut project_config = FunctionConfig::load(&root, None, None)?;
            project_config.function_id.clone_from(&project.id);
            project_config.organization_id.clone_from(&organization.id);
            project_config.write(&root)?;

            println!();
            println!(" {} Project linked!", style("◼").magenta());

            Ok(())
        }
    }
}
