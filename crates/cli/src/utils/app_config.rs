use super::{validate_assets_dir, validate_code_file};
use crate::utils::get_theme;
use anyhow::{anyhow, Result};
use dialoguer::console::style;
use dialoguer::{Confirm, Input};
use pathdiff::diff_paths;
use serde::{Deserialize, Serialize};
use std::{
    fs,
    path::{Path, PathBuf},
};

#[derive(Serialize, Deserialize, Debug)]
pub struct ApplicationConfig {
    /// Id of the application
    pub application_id: String,

    /// Path to the application's handler file (optional)
    pub handler: PathBuf,

    /// Path to the application's assets directory (optional)
    pub assets: Option<PathBuf>,

    // TODO: do we need this? if not remove!
    /// Path to the application's client file (optional)
    /// Deprecated: will probably be removed in future versions
    pub client: Option<PathBuf>,
}

impl ApplicationConfig {
    pub fn load(
        root: &Path,
        client_override: Option<PathBuf>,
        assets_override: Option<PathBuf>,
    ) -> Result<ApplicationConfig> {
        let path = get_application_config_path(root);

        if !path.exists() {
            println!(
                "{}",
                style(format!(
                    "No configuration found in directory {} ...",
                    path.display()
                ))
                .black()
                .bright()
            );
            println!();

            let index = match client_override {
                Some(index) => {
                    println!("{}", style("Using custom entrypoint...").black().bright());
                    index
                }
                None => {
                    let index = Input::<String>::with_theme(get_theme())
                        .with_prompt(format!(
                            "Path to your application's entrypoint? {}",
                            style(format!("(relative to {:?})", root.canonicalize()?))
                                .black()
                                .bright()
                        ))
                        .validate_with(|input: &String| -> std::result::Result<(), String> {
                            validate_code_file(&root.join(input), root)
                                .map_err(|err| err.to_string())
                        })
                        .interact_text()?;

                    PathBuf::from(index)
                }
            };

            let assets = match assets_override {
                Some(assets) => {
                    println!(
                        "{}",
                        style("Using custom assets directory...").black().bright()
                    );
                    Some(assets)
                }
                None => match Confirm::with_theme(get_theme())
                    .with_prompt("Do you have a directory to serve assets from?")
                    .default(false)
                    .interact()?
                {
                    true => {
                        let assets = Input::<String>::with_theme(get_theme())
                            .with_prompt(format!(
                                "Path to your application's assets directory? {}",
                                style(format!("(relative to {:?})", root.canonicalize()?))
                                    .black()
                                    .bright(),
                            ))
                            .validate_with(|input: &String| -> std::result::Result<(), String> {
                                validate_assets_dir(&root.join(input), root)
                                    .map_err(|err| err.to_string())
                            })
                            .interact_text()?;

                        Some(PathBuf::from(assets))
                    }
                    false => None,
                },
            };

            let config = ApplicationConfig {
                application_id: String::from(""),
                handler: index,
                client: None,
                assets,
            };

            config.write(root)?;
            println!();

            return Ok(config);
        }

        println!("{}", style("Found configuration file...").black().bright());

        let content = fs::read_to_string(path)?;
        let mut config = serde_json::from_str::<ApplicationConfig>(&content)?;

        if let Some(client_override) = client_override {
            println!("{}", style("Using custom client file...").black().bright());
            config.client = Some(client_override);
        }

        if let Some(assets_override) = assets_override {
            println!(
                "{}",
                style("Using custom assets directory...").black().bright()
            );
            config.assets = Some(assets_override);
        }

        validate_code_file(&config.handler, root)?;

        if let Some(client) = &config.client {
            validate_code_file(client, root)?;
        }

        if let Some(assets) = &config.assets {
            validate_assets_dir(assets, root)?;
        }

        println!();

        Ok(config)
    }

    pub fn write(&self, root: &Path) -> Result<()> {
        let path = get_application_config_path(root);

        if !path.exists() {
            fs::create_dir_all(root.join(".lagoss"))?;
        }

        let content = serde_json::to_string(self)?;
        fs::write(path, content)?;
        Ok(())
    }

    pub fn delete(&self, root: &Path) -> Result<()> {
        let path = get_application_config_path(root);

        if !path.exists() {
            return Err(anyhow!("No configuration found in this directory.",));
        }

        fs::remove_file(path)?;
        Ok(())
    }
}

pub fn get_application_config_path(root: &Path) -> PathBuf {
    root.join(".lagoss").join("config.json")
}

pub fn get_root(root: Option<PathBuf>) -> PathBuf {
    match root {
        Some(path) => path, // TODO: find closes parent with .lagoss
        None => std::env::current_dir().unwrap(),
    }
}

pub fn resolve_application_path(
    path: Option<PathBuf>,
    client: Option<PathBuf>,
    assets_dir: Option<PathBuf>,
) -> Result<(PathBuf, ApplicationConfig)> {
    let path = path.unwrap_or_else(|| PathBuf::from("."));

    if !path.exists() {
        return Err(anyhow!("File or directory not found"));
    }

    match path.is_file() {
        true => {
            let root = PathBuf::from(path.parent().unwrap());

            let index = diff_paths(&path, &root).unwrap();
            let client = client.map(|client| diff_paths(client, &root).unwrap());
            let assets = assets_dir.map(|assets_dir| diff_paths(assets_dir, &root).unwrap());

            Ok((
                root,
                ApplicationConfig {
                    application_id: String::new(),
                    handler: index,
                    client,
                    assets,
                },
            ))
        }
        false => Ok((
            path.clone(),
            ApplicationConfig::load(&path, client, assets_dir)?,
        )),
    }
}
