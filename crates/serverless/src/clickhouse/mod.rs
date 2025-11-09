pub mod client;
pub mod migrations;

use clickhouse::Row;
use serde::{Deserialize, Serialize};

#[derive(Row, Serialize, Deserialize)]
pub struct LogRow {
    pub request_id: String,
    pub app_id: String,
    pub deployment_id: String,
    pub level: String,
    pub message: String,
    pub region: String,
    pub timestamp: u32,
}

#[derive(Row, Serialize, Deserialize)]
pub struct RequestRow {
    pub id: String,
    pub app_id: String,
    pub deployment_id: String,
    pub region: String,
    pub bytes_in: u32,
    pub bytes_out: u32,
    pub cpu_time_micros: Option<u128>,
    pub timestamp: u32,
    pub response_status_code: u16,
    pub url: String,
    pub http_method: String,
}
