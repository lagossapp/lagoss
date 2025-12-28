use std::{fs, path::Path};

use anyhow::Result;
use lagoss_runtime_utils::DEPLOYMENTS_DIR;
use log::info;

pub fn create_deployments_folder() -> Result<()> {
    let path = Path::new(DEPLOYMENTS_DIR);

    if !path.exists() {
        fs::create_dir(path)?;
        info!("Created deployments folder");
    }

    Ok(())
}

pub fn rm_deployment(deployment_id: &str) -> Result<()> {
    let is_test = std::env::var("LAGOSS_TEST").is_ok() || cfg!(test);
    if !is_test {
        let path = Path::new(DEPLOYMENTS_DIR).join(deployment_id);
        if path.exists() {
            fs::remove_dir_all(path)?;
        }
    }

    info!(deployment = deployment_id; "Deleted deployment");

    Ok(())
}
