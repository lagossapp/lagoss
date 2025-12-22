use clickhouse::{test::handlers, Client};
use lagoss_runtime::{options::RuntimeOptions, Runtime};
use lagoss_serverless::clickhouse::{LogRow, RequestRow};
use std::sync::Once;

use crate::utils::mock::Mock;

mod mock;

pub async fn setup() -> Client {
    static START: Once = Once::new();

    START.call_once(|| {
        dotenv::dotenv().expect("Failed to load .env file");

        Runtime::new(RuntimeOptions::default());
    });

    let mock = Mock::new().await;
    mock.add(handlers::record::<RequestRow>());
    mock.add(handlers::record::<LogRow>());
    Client::default().with_url(mock.url())
}
