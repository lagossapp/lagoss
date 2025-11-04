use anyhow::Result;
use lagoss_runtime::{options::RuntimeOptions, Runtime};
use lagoss_serverless::clickhouse::client::create_client;
use lagoss_serverless::clickhouse::migrations::run_migrations;
use lagoss_serverless::deployments::get_deployments;
use lagoss_serverless::get_region;
use lagoss_serverless::serverless::start;
use lagoss_serverless_downloader::{get_bucket, S3BucketDownloader};
use lagoss_serverless_logger::init_logger;
use lagoss_serverless_pubsub::RedisPubSub;
use log::info;
use metrics_exporter_prometheus::PrometheusBuilder;
#[cfg(not(debug_assertions))]
use std::borrow::Cow;
use std::env;
use std::net::SocketAddr;
#[cfg(not(debug_assertions))]
use std::path::Path;
use std::sync::Arc;

// Jemalloc does not work on Windows
#[cfg(not(target_env = "msvc"))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;

#[tokio::main]
async fn main() -> Result<()> {
    // Only load a .env file on development
    #[cfg(debug_assertions)]
    dotenv::dotenv().expect("Failed to load .env file");

    let _flush_guard = init_logger(get_region().clone()).expect("Failed to init logger");

    info!("Starting serverless runtime");

    let runtime = Runtime::new(RuntimeOptions::default());
    let addr: SocketAddr = env::var("LAGOSS_LISTEN_ADDR")
        .expect("LAGOSS_LISTEN_ADDR must be set")
        .parse()?;
    let prometheus_addr: SocketAddr = env::var("PROMETHEUS_LISTEN_ADDR")
        .expect("PROMETHEUS_LISTEN_ADDR must be set")
        .parse()?;

    let mut builder = PrometheusBuilder::new()
        .with_http_listener(prometheus_addr)
        .add_global_label("region", get_region());

    if let Ok(allowed_subnet) = env::var("PROMETHEUS_ALLOWED_SUBNET") {
        if !allowed_subnet.is_empty() {
            info!("Allowing Prometheus exporter to be accessed from {allowed_subnet}");

            builder = builder.add_allowed_address(allowed_subnet)?;
        }
    }

    builder.install().expect("Failed to start metrics exporter");

    let bucket = get_bucket()?;
    let downloader = Arc::new(S3BucketDownloader::new(bucket));

    let url = env::var("REDIS_URL").expect("REDIS_URL must be set");
    let pubsub = RedisPubSub::new(url);

    let client = create_client().await?;
    run_migrations(&client).await?;

    let api_url = env::var("LAGOSS_URL").expect("LAGOSS_URL must be set");
    let api_token = env::var("LAGOSS_API_TOKEN").expect("LAGOSS_API_TOKEN must be set");
    let deployments = get_deployments(api_url, api_token).await?;

    let serverless = start(deployments, addr, downloader, pubsub, client).await?;
    tokio::spawn(serverless).await?;

    runtime.dispose();

    Ok(())
}
