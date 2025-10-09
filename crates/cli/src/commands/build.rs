use crate::utils::{bundle_application, print_progress, resolve_application_path};
use anyhow::{anyhow, Result};
use dialoguer::console::style;
use std::{fs, path::PathBuf};

pub fn build(path: Option<PathBuf>, assets_dir: Option<PathBuf>) -> Result<()> {
    let (root, application_config) = resolve_application_path(path, assets_dir)?;
    let (index, assets) = bundle_application(&application_config, &root, true)?;

    let end_progress = print_progress("Writing files");
    let root = root.join(".lagoss");

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
