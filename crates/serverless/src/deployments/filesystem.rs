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
    #[cfg(not(feature = "test"))]
    {
        fs::remove_dir_all(Path::new(DEPLOYMENTS_DIR).join(deployment_id))?;
    }

    info!(deployment = deployment_id; "Deleted deployment");

    Ok(())
}
