use super::{validate_assets_dir, validate_code_file};
use crate::utils::{get_pretty_path, get_theme};
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
    pub handler: Option<PathBuf>,

    /// Path to the application's assets directory (optional)
    pub assets: Option<PathBuf>,
}

impl ApplicationConfig {
    pub fn load(
        root: &Path,
        handler_override: Option<PathBuf>,
        assets_override: Option<PathBuf>,
    ) -> Result<ApplicationConfig> {
        // load config or blank config and use as base
        // apply overrides (handler, assets) if any
        // if no still no handler or assets => detect
        // try to detect handler (lagoss-handler.js, index.js, index.ts, ...)
        // if no handler try to detect static deployment folder (current, dist, public, ...) with index.html
        // if still nothing prompt or error

        let config_path = get_application_config_path(root);
        let mut application_config = ApplicationConfig {
            application_id: String::from(""),
            handler: None,
            assets: None,
        };

        let config_exists = config_path.clone().exists();
        if config_exists {
            println!(
                "{} {}",
                style("Using configuration file from").black().bright(),
                config_path.display()
            );

            let content = fs::read_to_string(config_path.clone())?;
            application_config = serde_json::from_str::<ApplicationConfig>(&content)?;
        }

        if let Some(handler_override) = handler_override.clone() {
            println!(
                "{} {}",
                style("Using custom handler").black().bright(),
                get_pretty_path(root, handler_override.as_path())
            );
            application_config.handler = Some(handler_override);
        }

        if let Some(assets_override) = assets_override.clone() {
            println!(
                "{} {}",
                style("Using custom assets directory").black().bright(),
                get_pretty_path(root, assets_override.as_path())
            );
            application_config.assets = Some(assets_override);
        }

        if !config_exists {
            println!(
                "{} {}",
                style("No configuration found at").black().bright(),
                get_pretty_path(root, config_path.as_path())
            );

            application_config.handler = application_config.handler.or_else(|| {
                let detected = detect_handler(root);
                if let Some(ref handler) = detected {
                    println!(
                        "{} Handler detected: {}",
                        style("✓").green().bright(),
                        get_pretty_path(root, handler)
                    );
                }
                detected
            });

            // only try to detect assets directory if handler is not set
            if !application_config.handler.is_some() {
                application_config.assets = application_config.assets.or_else(|| {
                    let detected = detect_assets_directory(root);
                    if let Some(ref detected) = detected {
                        println!(
                            "{} Assets directory detected: {}",
                            style("✓").green().bright(),
                            get_pretty_path(root, detected)
                        );
                    }
                    detected
                });
            }

            // if still no handler or assets, prompt for assets directory
            if application_config.handler.is_none() && application_config.assets.is_none() {
                application_config.assets = match Confirm::with_theme(get_theme())
                    .with_prompt("Do you have an assets directory to serve assets from?")
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
                };
            }
        }

        if let Some(handler) = &application_config.handler {
            validate_code_file(handler, root)?;
        }

        if let Some(assets_dir) = &application_config.assets {
            validate_assets_dir(assets_dir, root)?;
        }

        if application_config.handler.is_none() && application_config.assets.is_none() {
            return Err(anyhow!(
                "No handler or assets directory specified or detected.",
            ));
        }

        Ok(application_config)
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

fn detect_handler(root: &Path) -> Option<PathBuf> {
    let candidates = [
        "lagoss-handler.js",
        "lagoss-handler.js",
        "index.ts",
        "index.mjs",
        "index.cjs",
        "index.js",
    ];

    for candidate in candidates {
        let path = root.join(candidate);
        if path.exists() && path.is_file() {
            return Some(PathBuf::from(candidate));
        }
    }

    None
}

/// Try to detect an assets directory. Check if it contains an index.html file.
fn detect_assets_directory(root: &Path) -> Option<PathBuf> {
    let candidates = ["", "dist", "public", "assets", "static", "www"];

    for candidate in candidates {
        let path = root.join(candidate);
        let has_index = path.join("index.html").exists() && path.join("index.html").is_file();
        if path.exists() && path.is_dir() && !(candidate == "" && !has_index) {
            return Some(PathBuf::from(candidate));
        }
    }

    None
}

pub fn resolve_application_path(
    path: Option<PathBuf>,
    assets_dir: Option<PathBuf>,
) -> Result<(PathBuf, ApplicationConfig)> {
    let path = path.unwrap_or_else(|| PathBuf::from("."));

    if !path.exists() {
        return Err(anyhow!("File or directory not found"));
    }

    match path.is_file() {
        true => {
            let root = PathBuf::from(path.parent().unwrap());

            let handler = diff_paths(&path, &root).unwrap();
            let assets = assets_dir.map(|assets_dir| diff_paths(assets_dir, &root).unwrap());

            Ok((
                root,
                ApplicationConfig {
                    application_id: String::new(),
                    handler: Some(handler),
                    assets,
                },
            ))
        }
        false => Ok((
            // TODO: should we detect a config from a parent directory?
            path.clone(),
            ApplicationConfig::load(&path, None, assets_dir)?,
        )),
    }
}
