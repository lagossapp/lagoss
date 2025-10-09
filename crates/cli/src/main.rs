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
    /// Path to a configuration file
    #[clap(short, long, env = "LAGOSS_TOKEN")]
    token: Option<String>,
    /// Path to a configuration file
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
        #[clap(value_parser)]
        path: Option<PathBuf>,
        /// Path to a client-side script
        #[clap(short, long, value_parser)]
        client: Option<PathBuf>,
        /// Folder of static assets to be served.
        #[clap(short, long, value_parser)]
        assets: Option<PathBuf>,
        /// Deploy to production
        #[clap(visible_alias = "production", long)]
        prod: bool,
    },
    /// Delete an existing application
    Rm {
        /// Path to a directory containing a handler
        #[clap(value_parser)]
        directory: Option<PathBuf>,
    },
    /// Start a local dev server to test an application
    Dev {
        /// Path to a handler file or directory containing an application
        #[clap(value_parser)]
        path: Option<PathBuf>,
        /// Path to a client-side script
        #[clap(short, long, value_parser)]
        client: Option<PathBuf>,
        /// Folder of static assets to be served.
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
        #[clap(value_parser)]
        path: Option<PathBuf>,
        /// Path to a client-side script
        #[clap(short, long, value_parser)]
        client: Option<PathBuf>,
        /// Folder of static assets to be served.
        #[clap(short, long, value_parser)]
        assets: Option<PathBuf>,
    },
    /// Link a local folder to an already deployed application
    Link {
        /// Path to a directory containing an application
        #[clap(value_parser)]
        directory: Option<PathBuf>,
    },
    /// List all the deployments for an application
    Ls {
        /// Path to a directory containing an application
        #[clap(value_parser)]
        directory: Option<PathBuf>,
    },
    /// Undeploy a given deployment
    Undeploy {
        /// ID of the deployment to undeploy
        deployment_id: String,
        /// Path to a directory containing an application
        #[clap(value_parser)]
        directory: Option<PathBuf>,
    },
    /// Promote the given preview deployment to production
    Promote {
        /// ID of the deployment to promote
        deployment_id: String,
        /// Path to a directory containing an application
        #[clap(value_parser)]
        directory: Option<PathBuf>,
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
            Commands::Deploy {
                path,
                client,
                assets,
                prod,
            } => commands::deploy(&config, path, client, assets, prod).await,
            Commands::Rm { directory } => commands::rm(&config, directory).await,
            Commands::Dev {
                path,
                client,
                assets,
                port,
                hostname,
                env,
                allow_code_generation,
                prod,
            } => {
                commands::dev(
                    path,
                    client,
                    assets,
                    port,
                    hostname,
                    env,
                    allow_code_generation,
                    prod,
                )
                .await
            }
            Commands::Build {
                path,
                client,
                assets,
            } => commands::build(path, client, assets),
            Commands::Link { directory } => commands::link(&config, directory).await,
            Commands::Ls { directory } => commands::ls(&config, directory).await,
            Commands::Undeploy {
                deployment_id,
                directory,
            } => commands::undeploy(&config, deployment_id, directory).await,
            Commands::Promote {
                deployment_id,
                directory,
            } => commands::promote(&config, deployment_id, directory).await,
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
