use crate::utils::{bundle_application, print_progress, ApplicationConfig};
use anyhow::{anyhow, Result};
use dialoguer::console::style;
use std::{fs, path::PathBuf};

pub fn build(path: Option<PathBuf>, assets_dir: Option<PathBuf>) -> Result<()> {
    let application_config = ApplicationConfig::load(path, assets_dir, None)?;
    let (index, assets) = bundle_application(&application_config, true)?;

    let end_progress = print_progress("Writing files");
    let root = application_config.path.join(".lagoss");

    fs::create_dir_all(&root)?;
    fs::write(root.join("index.js"), index)?;

    for (path, content) in assets {
        let dir = root.join("public").join(
            PathBuf::from(&path)
                .parent()
                .ok_or_else(|| anyhow!("Could not find parent of {}", path))?,
        );
        fs::create_dir_all(dir)?;
        fs::write(root.join("public").join(path), content)?;
    }

    end_progress();

    println!();
    println!(" {} Build successful!", style("◼").magenta());
    println!(
        "   {}",
        style(format!("You can find it in {:?}", root))
            .black()
            .bright()
    );

    Ok(())
}
