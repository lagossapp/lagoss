use crate::utils::{get_theme, print_progress, ApiClient, Config};
use anyhow::{anyhow, Result};
use dialoguer::{console::style, Confirm, Password};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct CliResponse {
    token: String,
}

#[derive(Serialize, Debug)]
struct CliRequest {
    code: String,
}

pub async fn login(mut config: Config) -> Result<()> {
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

    config.set_token(Some(token.clone()));

    let client = ApiClient::new(config.clone());
    let request = CliRequest { code: token };

    match client
        .post::<CliRequest, CliResponse>("tokensAuthenticate", request)
        .await
    {
        Ok(response) => {
            config.set_token(Some(response.token));
            config.save()?;

            println!();
            println!(" {} You are now logged in!", style("◼").magenta());
            println!(
                "   {}",
                style("You can now close the browser tab").black().bright()
            );

            Ok(())
        }
        Err(_) => Err(anyhow!("Failed to log in.")),
    }
}
