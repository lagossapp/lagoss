use crate::utils::{
    create_deployment, get_theme, lookup_application_id, print_progress, ApiClient,
    ApplicationConfig, Config,
};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm, Input, Select};
use serde::{Deserialize, Serialize};
use std::{
    fmt::{Display, Formatter},
    path::PathBuf,
};

#[derive(Deserialize, Debug)]
pub struct Organization {
    pub name: String,
    pub id: String,
}

impl Display for Organization {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

pub type OrganizationsResponse = Vec<Organization>;

#[derive(Serialize, Debug)]
struct CreateApplicationRequest {
    name: String,
    domains: Vec<String>,
    env: Vec<String>,
    cron: Option<String>,
}

#[derive(Deserialize, Debug)]
struct CreateApplicationResponse {
    id: String,
}

#[derive(Deserialize, Debug)]
pub struct Application {
    pub id: String,
    pub name: String,
}

impl Display for Application {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

pub type ApplicationsResponse = Vec<Application>;

pub async fn deploy(
    config: &Config,
    path: Option<PathBuf>,
    assets_dir: Option<PathBuf>,
    is_production: bool,
    app_id_or_name: Option<String>,
) -> Result<()> {
    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let application_config =
        get_application_config(config, path, assets_dir, app_id_or_name).await?;

    create_deployment(config, &application_config, is_production, true).await?;

    Ok(())
}

async fn get_application_config(
    config: &Config,
    path: Option<PathBuf>,
    assets_dir: Option<PathBuf>,
    app_id_or_name: Option<String>,
) -> Result<ApplicationConfig> {
    let app_id = lookup_application_id(config, app_id_or_name).await?;

    let mut app_config = ApplicationConfig::load(path, assets_dir, app_id)?;

    if !app_config.application_id.is_empty() {
        return Ok(app_config);
    }

    println!(
        "{}",
        style("Could not find a linked application.")
            .black()
            .bright()
    );

    let client = ApiClient::new(config.clone());

    let organizations = client
        .get::<OrganizationsResponse>("/api/organizations")
        .await?;

    let index = Select::with_theme(get_theme())
        .items(&organizations)
        .default(0)
        .with_prompt("Which Organization would you like to deploy to?")
        .interact()?;
    let organization = &organizations[index];

    match Confirm::with_theme(get_theme())
        .with_prompt("Link to an existing application?")
        .default(false)
        .interact()?
    {
        true => {
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

            app_config.application_id.clone_from(&application.id);
            app_config.write()?;

            Ok(app_config)
        }
        false => {
            let name = Input::<String>::with_theme(get_theme())
                .with_prompt("What's the name of this new application?")
                .interact_text()?;

            let message = format!("Creating an application {name}");
            let end_progress = print_progress(&message);

            let application = client
                .post::<CreateApplicationRequest, CreateApplicationResponse>(
                    &format!("/api/organizations/{}/projects", organization.id),
                    CreateApplicationRequest {
                        name,
                        domains: Vec::new(),
                        env: Vec::new(),
                        cron: None,
                    },
                )
                .await?;

            end_progress();

            app_config.application_id.clone_from(&application.id);
            app_config.write()?;

            Ok(app_config)
        }
    }
}
