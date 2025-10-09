use clap::{Parser, Subcommand};
use dialoguer::console::style;
use serde::Deserialize;
use std::{path::PathBuf, process::exit};

use crate::utils::Config;

mod commands;
mod utils;

static PACKAGE_JSON: &str = include_str!("../package.json");

#[derive(Deserialize)]
struct PackageJson {
    version: String,
}

#[derive(Parser, Debug)]
#[command(author, about, long_about = None, arg_required_else_help = true)]
struct CliArgs {
    #[clap(subcommand)]
    command: Option<Commands>,
    /// Print version information
    #[clap(short, long)]
    version: bool,
    /// Your Lagoss API token
    #[clap(short, long, env = "LAGOSS_TOKEN")]
    token: Option<String>,
    /// Api endpoint of Lagoss to use (default: https://console.lagoss.com)
    #[clap(short, long, env = "LAGOSS_SITE_URL")]
    site_url: Option<String>,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Log in to Lagoss
    Login,
    /// Log out of Lagoss
    Logout,
    /// Deploy a new or existing application
    Deploy {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
        /// Folder of static assets to be served
        #[clap(short, long, value_parser)]
        assets: Option<PathBuf>,
        /// Deploy to production
        #[clap(visible_alias = "production", long)]
        prod: bool,
    },
    /// Delete an existing application
    Rm {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
    },
    /// Start a local dev server to test an application
    Dev {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
        /// Folder of static assets to be served
        #[clap(short, long, value_parser)]
        assets: Option<PathBuf>,
        /// Port to start dev server on
        #[clap(long)]
        port: Option<u16>,
        /// Hostname to listen on
        #[clap(long)]
        hostname: Option<String>,
        /// Path to a custom environment variables file to use
        #[clap(short, long, value_parser)]
        env: Option<PathBuf>,
        /// Allow code generation from strings using `eval` / `new Function`
        #[clap(long)]
        allow_code_generation: bool,
        /// Force `process.env.NODE_ENV` to be "production"
        #[clap(visible_alias = "production", long)]
        prod: bool,
    },
    /// Build an application without deploying it
    Build {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
        /// Folder of static assets to be served
        #[clap(short, long, value_parser)]
        assets: Option<PathBuf>,
    },
    /// Link a local folder to an already deployed application
    Link {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
    },
    /// List all the deployments for an application
    Ls {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
    },
    /// Undeploy a given deployment
    Undeploy {
        /// ID of the deployment to undeploy
        deployment_id: String,
        /// Path to a directory containing an application
        #[clap(value_parser)]
        path: Option<PathBuf>,
    },
    /// Promote the given preview deployment to production
    Promote {
        /// ID of the deployment to promote
        deployment_id: String,
        /// Path to a handler file or directory containing an application
        #[clap(value_parser, default_value = ".")]
        path: Option<PathBuf>,
    },
}

#[tokio::main]
async fn main() {
    let args = CliArgs::parse();

    let config = Config::from_args(&args).unwrap_or_else(|err| {
        println!("{} {}", style("✕").red(), err);
        exit(1);
    });

    if let Some(command) = args.command {
        if let Err(err) = match command {
            Commands::Login => commands::login(&config).await,
            Commands::Logout => commands::logout(&config),
            Commands::Deploy { path, assets, prod } => {
                commands::deploy(&config, path, assets, prod).await
            }
            Commands::Rm { path } => commands::rm(&config, path).await,
            Commands::Dev {
                path,
                assets,
                port,
                hostname,
                env,
                allow_code_generation,
                prod,
            } => {
                commands::dev(
                    path,
                    assets,
                    port,
                    hostname,
                    env,
                    allow_code_generation,
                    prod,
                )
                .await
            }
            Commands::Build { path, assets } => commands::build(path, assets),
            Commands::Link { path } => commands::link(&config, path).await,
            Commands::Ls { path } => commands::ls(&config, path).await,
            Commands::Undeploy {
                deployment_id,
                path,
            } => commands::undeploy(&config, deployment_id, path).await,
            Commands::Promote {
                deployment_id,
                path,
            } => commands::promote(&config, deployment_id, path).await,
        } {
            println!("{} {}", style("✕").red(), err);
            exit(1);
        }
    } else {
        match serde_json::from_str(PACKAGE_JSON) {
            Ok(PackageJson { version }) => {
                println!("{version}");
            }
            _ => {
                println!(
                    "{} Couldn't extract version from package.json",
                    style("✕").red(),
                );
                exit(1);
            }
        }
    }
}
