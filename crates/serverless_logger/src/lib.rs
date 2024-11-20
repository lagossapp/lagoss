use axiom_rs::Client;
use chrono::prelude::Local;
use flume::Sender;
use log::kv::{Key, Source, Visitor};
use log::{
    set_boxed_logger, set_max_level, Level, LevelFilter, Log, Metadata, Record, SetLoggerError,
};
use serde::ser::SerializeMap;
use serde::{Serialize, Serializer};
use serde_json::{json, Value};
use std::sync::{Arc, RwLock};

// TODO: cleanup record.key_values() to serde serialization

/// The result of calling `Source::as_map`.
pub struct AsMap<S>(S);
/// Visit this source as a map.
pub fn as_map<S>(source: S) -> AsMap<S>
where
    S: Source,
{
    AsMap(source)
}
impl<S> Source for AsMap<S>
where
    S: Source,
{
    fn visit<'kvs>(
        &'kvs self,
        visitor: &mut dyn log::kv::Visitor<'kvs>,
    ) -> Result<(), log::kv::Error> {
        self.0.visit(visitor)
    }
    fn get(&self, key: log::kv::Key) -> Option<log::kv::Value<'_>> {
        self.0.get(key)
    }
    fn count(&self) -> usize {
        self.0.count()
    }
}

impl<T> Serialize for AsMap<T>
where
    T: Source,
{
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        struct SerializerVisitor<'a, S>(&'a mut S);
        impl<'a, 'kvs, S> Visitor<'kvs> for SerializerVisitor<'a, S>
        where
            S: SerializeMap,
        {
            fn visit_pair(
                &mut self,
                key: Key<'kvs>,
                value: log::kv::Value<'kvs>,
            ) -> Result<(), log::kv::Error> {
                self.0
                    .serialize_entry(&key, &value)
                    .map_err(|_| log::kv::Error::msg("failed to serialize map entry"))?;
                Ok(())
            }
        }
        let mut map = serializer.serialize_map(Some(self.count()))?;
        self.visit(&mut SerializerVisitor(&mut map))
            .map_err(|_| serde::ser::Error::custom("failed to serialize map"))?;
        map.end()
    }
}

struct SimpleLogger {
    tx: Arc<RwLock<Option<Sender<Value>>>>,
    region: String,
}

impl SimpleLogger {
    pub fn new(region: String) -> Self {
        let (tx, rx) = flume::unbounded();

        // Axiom is optional
        match Client::new() {
            Ok(axiom_client) => {
                tokio::spawn(async move {
                    if let Err(error) = axiom_client
                        .ingest_stream("serverless", rx.into_stream())
                        .await
                    {
                        eprintln!("Error ingesting into Axiom: {error}");
                    }
                });
            }
            Err(error) => println!("Axiom is not configured: {error} (can be ignored)"),
        }

        Self {
            tx: Arc::new(RwLock::new(Some(tx))),
            region,
        }
    }
}

impl Log for SimpleLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= Level::Info
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            let metadata = as_map(record.key_values());

            println!(
                "{} - {} - {} - {}",
                Local::now(),
                record.level(),
                record.args(),
                serde_json::to_value(&metadata).unwrap(),
            );

            // Axiom is optional, so tx can have no listeners
            let tx = self.tx.read().expect("Tx lock is poisoned");

            if let Some(tx) = &*tx {
                if !tx.is_disconnected() {
                    tx.send(json!({
                        "region": self.region,
                        "_time": Local::now().to_rfc3339(),
                        "level": record.level().to_string(),
                        "message": record.args().to_string(),
                        "metadata": metadata,
                    }))
                    .unwrap_or(())
                }
            }
        }
    }

    fn flush(&self) {
        let mut tx = self.tx.write().expect("Tx lock is poisoned");
        tx.take();
    }
}

pub struct FlushGuard;

impl Drop for FlushGuard {
    fn drop(&mut self) {
        log::logger().flush()
    }
}

pub fn init_logger(region: String) -> Result<FlushGuard, SetLoggerError> {
    set_boxed_logger(Box::new(SimpleLogger::new(region)))
        .map(|()| set_max_level(LevelFilter::Info))?;

    Ok(FlushGuard)
}
