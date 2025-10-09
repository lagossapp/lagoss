use crate::utils::{get_theme, print_progress, Config};
use anyhow::Result;
use dialoguer::{console::style, Confirm, Password};

pub async fn login(config: &Config) -> Result<()> {
    if config.token.is_some()
        && !Confirm::with_theme(get_theme())
            .with_prompt("You are already logged in. Do you want to log out and log in again?")
            .default(true)
            .interact()?
    {
        println!();
        println!("{} Login aborted", style("✕").red());
        return Ok(());
    }

    println!();

    let end_progress = print_progress("Opening browser");

    // TODO: find open port for webserver
    let callback = "http://localhost:1234/cli";

    let url = config.site_url.clone() + "/cli?callback=" + callback;

    // TODO: open webserver for callback

    if webbrowser::open(&url).is_err() {
        println!("{} Could not open browser", style("✕").red());
    }

    end_progress();
    println!(
        "{}",
        style(format!("   You can also manually access {}", url))
            .black()
            .bright()
    );
    println!();

    let token = Password::with_theme(get_theme())
        .with_prompt("Paste the token from your browser here")
        .interact()?;

    let mut config = config.clone();
    config.set_token(Some(token.clone()));
    config.save()?;

    return Ok(());
}
