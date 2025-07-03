use crate::utils::{
    create_deployment, get_theme, print_progress, resolve_path, Config, TrpcClient,
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
struct CreateProjectRequest {
    name: String,
    domains: Vec<String>,
    env: Vec<String>,
    cron: Option<String>,
}

#[derive(Deserialize, Debug)]
struct CreateProjectResponse {
    id: String,
}

#[derive(Deserialize, Debug)]
pub struct Project {
    pub id: String,
    pub name: String,
}

impl Display for Project {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

pub type ProjectsResponse = Vec<Project>;

pub async fn deploy(
    path: Option<PathBuf>,
    client: Option<PathBuf>,
    public_dir: Option<PathBuf>,
    is_production: bool,
) -> Result<()> {
    let config = Config::new()?;

    if config.token.is_none() {
        return Err(anyhow!(
            "You are not logged in. Please log in with `lagoss login`",
        ));
    }

    let (root, mut project_config) = resolve_path(path, client, public_dir)?;

    if project_config.function_id.is_empty() {
        println!(
            "{}",
            style("No previous Deployment found...").black().bright()
        );
        println!();

        let client = TrpcClient::new(config.clone());

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
            .with_prompt("Link to an existing project?")
            .default(false)
            .interact()?
        {
            true => {
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

                project_config.function_id.clone_from(&project.id);
                project_config.organization_id.clone_from(&organization.id);
                project_config.write(&root)?;

                println!();
                create_deployment(config, &project_config, is_production, &root, true).await?;
            }
            false => {
                let name = Input::<String>::with_theme(get_theme())
                    .with_prompt("What's the name of this new project?")
                    .interact_text()?;

                println!();
                let message = format!("Creating project {name}");
                let end_progress = print_progress(&message);

                let project = client
                    .post::<CreateProjectRequest, CreateProjectResponse>(
                        &format!("/api/organizations/{}/projects", organization.id),
                        CreateProjectRequest {
                            name,
                            domains: Vec::new(),
                            env: Vec::new(),
                            cron: None,
                        },
                    )
                    .await?;

                end_progress();

                project_config.function_id.clone_from(&project.id);
                project_config.organization_id.clone_from(&organization.id);
                project_config.write(&root)?;

                create_deployment(config, &project_config, is_production, &root, true).await?;
            }
        }
    } else {
        create_deployment(config, &project_config, is_production, &root, true).await?;
    }

    Ok(())
}
