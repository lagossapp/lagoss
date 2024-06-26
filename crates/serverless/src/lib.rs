use std::{env, sync::OnceLock};

pub mod clickhouse;
pub mod cronjob;
pub mod deployments;
pub mod serverless;

static REGION: OnceLock<String> = OnceLock::new();

pub fn get_region() -> &'static String {
    REGION.get_or_init(|| env::var("LAGOSS_REGION").expect("LAGOSS_REGION must be set"))
}

pub const SNAPSHOT_BLOB: &[u8] = include_bytes!("../snapshot.bin");
