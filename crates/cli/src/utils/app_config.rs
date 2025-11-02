use super::{validate_assets_dir, validate_code_file};
use crate::utils::{get_pretty_path, get_theme, ApiClient, Config};
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
    #[serde(skip)]
    pub path: PathBuf,

    /// Id of the application
    pub application_id: String,

    /// Path to the application's handler file (optional)
    pub handler: Option<PathBuf>,

    /// Path to the application's assets directory (optional)
    pub assets: Option<PathBuf>,
}

impl ApplicationConfig {
    pub fn load(
        handler_or_path: Option<PathBuf>,
        assets_override: Option<PathBuf>,
        application_id_override: Option<String>,
    ) -> Result<ApplicationConfig> {
        let handler_or_path = handler_or_path.unwrap_or_else(|| PathBuf::from("."));

        if !handler_or_path.exists() {
            return Err(anyhow!("File or directory not found"));
        }

        // path could be file or directory
        let handler_override = if handler_or_path.is_file() {
            Some(diff_paths(handler_or_path.clone(), handler_or_path.parent().unwrap()).unwrap())
        } else {
            None
        };

        let path = if handler_or_path.is_file() {
            PathBuf::from(handler_or_path.parent().unwrap())
        } else {
            handler_or_path
        };

        // try to find closest .lagoss/config.json to path
        let application_config_path = find_application_config_path(&path);

        // load existing config or create new one
        let mut application_config = if let Some(config_path) = application_config_path.clone() {
            println!(
                "Using configuration file from {}",
                style(config_path.display()).black().bright()
            );
            let content = fs::read_to_string(config_path.clone())?;
            let mut app_config = serde_json::from_str::<ApplicationConfig>(&content)?;
            let root = config_path
                .parent()
                .unwrap()
                .parent()
                .unwrap()
                .to_path_buf();

            println!(
                "Using app root {}",
                style(root.canonicalize()?.display()).black().bright()
            );
            app_config.path = root;
            app_config
        } else {
            println!(
                "{}",
                style(format!("No configuration found at {}", path.display()))
                    .black()
                    .bright()
            );
            ApplicationConfig {
                path: path.clone(),
                application_id: String::from(""),
                handler: None,
                assets: None,
            }
        };

        // apply overrides
        if let Some(app_id) = application_id_override {
            application_config.application_id = app_id;
        }

        if let Some(handler) = handler_override {
            application_config.handler = Some(handler);
        }

        if let Some(assets) = assets_override {
            application_config.assets = Some(assets);
        }

        // stop if we found a config file
        if application_config_path.is_none() {
            // do some detection magic if necessary
            // if no handler or assets is set => try to detect (should we really do this?)
            //   - try to detect handler (lagoss-handler.js, index.ts, ...)
            //   - if no handler try to detect static deployment folder (current, dist, public, ...) with index.html
            //   - if still nothing prompt or error
            application_config = detect_application_config(application_config)?;
        }

        if let Some(handler) = &application_config.handler {
            validate_code_file(handler, application_config.path.as_path())?;
        }

        if let Some(assets_dir) = &application_config.assets {
            validate_assets_dir(assets_dir, application_config.path.as_path())?;
        }

        if application_config.handler.is_none() && application_config.assets.is_none() {
            return Err(anyhow!(
                "No handler or assets directory specified or detected.",
            ));
        }

        Ok(application_config)
    }

    pub fn write(&self) -> Result<()> {
        if !self.path.exists() {
            fs::create_dir_all(self.path.join(".lagoss"))?;
        }

        let content = serde_json::to_string(self)?;
        fs::write(self.path.clone(), content)?;
        Ok(())
    }

    pub fn delete(&self) -> Result<()> {
        if !self.path.exists() {
            return Err(anyhow!("No configuration found in this directory.",));
        }

        fs::remove_file(self.path.clone())?;
        Ok(())
    }

    pub fn clone(&self) -> ApplicationConfig {
        ApplicationConfig {
            path: self.path.clone(),
            application_id: self.application_id.clone(),
            handler: self.handler.clone(),
            assets: self.assets.clone(),
        }
    }
}

/// Get the path to the application config file (.lagoss/config.json)
/// starting from the given root directory and searching in parent directories.
pub fn find_application_config_path(root: &Path) -> Option<PathBuf> {
    let try_dir = root.join(".lagoss").join("config.json");
    if try_dir.exists() && try_dir.is_file() {
        return Some(try_dir);
    }

    if let Some(parent) = root.parent() {
        return find_application_config_path(parent);
    }

    None
}

#[derive(Deserialize, Debug)]
struct ApplicationResponse {
    id: String,
}

pub async fn lookup_application_id(
    config: &Config,
    id_or_name: Option<String>,
) -> Result<Option<String>> {
    if id_or_name.is_none() {
        return Ok(None);
    }

    let client = ApiClient::new(config.clone());

    if let Ok(application) = client
        .get::<ApplicationResponse>(&format!("/api/apps/{}", id_or_name.clone().unwrap()))
        .await
    {
        return Ok(Some(application.id));
    }

    // try by name if not found by id
    match client
        .get::<ApplicationResponse>(&format!(
            "/api/apps/by-name/{}",
            id_or_name.clone().unwrap()
        ))
        .await
    {
        Ok(application) => Ok(Some(application.id)),
        Err(_) => Err(anyhow!(
            "Could not find application by id or name for '{}'.",
            id_or_name.unwrap()
        )),
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
        if path.exists() && path.is_dir() && (!candidate.is_empty() || has_index) {
            return Some(PathBuf::from(candidate));
        }
    }

    None
}

fn detect_application_config(
    application_config: ApplicationConfig,
) -> Result<ApplicationConfig, anyhow::Error> {
    let mut application_config = application_config.clone();
    let root = &application_config.path;

    application_config.handler = application_config.handler.or_else(|| {
        let detected = detect_handler(root);
        if let Some(ref handler) = detected {
            println!(
                "Handler detected {}",
                style(get_pretty_path(root, handler)).black().bright()
            );
        }
        detected
    });

    // only try to detect assets directory if handler is not set
    if application_config.handler.is_none() {
        application_config.assets = application_config.assets.or_else(|| {
            let detected = detect_assets_directory(root);
            if let Some(ref detected) = detected {
                println!(
                    "Assets directory detected {}",
                    style(get_pretty_path(root, detected)).black().bright()
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
                        validate_assets_dir(&root.join(input), root).map_err(|err| err.to_string())
                    })
                    .interact_text()?;

                Some(PathBuf::from(assets))
            }
            false => None,
        };
    }

    Ok(application_config)
}
