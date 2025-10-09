use anyhow::{anyhow, Result};
use pathdiff::diff_paths;
use std::path::{Path, PathBuf};

mod app_config;
mod client;
mod config;
mod console;
mod deployments;

pub use app_config::*;
pub use client::*;
pub use config::*;
pub use console::*;
pub use deployments::*;

pub const MAX_FUNCTION_SIZE_MB: usize = 10 * 1024 * 1024; // 10MB
pub const MAX_ASSET_SIZE_MB: u64 = 10 * 1024 * 1024; // 10MB

pub fn validate_code_file(file: &Path, root: &Path) -> Result<()> {
    let path = root.join(file);

    if !path.exists() || !path.is_file() {
        return Err(anyhow!("{:?} is not a file", path));
    }

    match path.extension() {
        Some(ext) => {
            let validate = ext == "js"
                || ext == "jsx"
                || ext == "ts"
                || ext == "tsx"
                || ext == "mjs"
                || ext == "cjs";

            match validate {
                true => Ok(()),
                false => Err(anyhow!("Extension {} is not supported (should be one of .js, .jsx, .ts, .tsx, .mjs, .cjs)", ext.to_str().unwrap())),
            }
        }
        None => Err(anyhow!("No extension found for the given file.",)),
    }
}

pub fn validate_assets_dir(assets_dir: &PathBuf, root: &Path) -> Result<()> {
    let path = root.join(assets_dir);

    if !path.is_dir() {
        return Err(anyhow!("Assets directory {:?} does not exist.", path));
    }

    Ok(())
}

// TODO: find prettier way to do this
fn get_pretty_path(root: &Path, path: &Path) -> String {
    let path = if path.display().to_string().is_empty() {
        Path::new(".")
    } else {
        path
    };

    let diff = diff_paths(path, root)
        .unwrap_or_else(|| path.to_path_buf())
        .display()
        .to_string();

    if diff.is_empty() {
        ".".to_string()
    } else {
        diff.to_string()
    }
}
