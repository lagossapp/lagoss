-- Migration 001: Initial schema setup
-- Create the logs table
CREATE TABLE IF NOT EXISTS logs
(
    function_id String,
    deployment_id String,
    level String,
    message String,
    region String,
    timestamp DateTime
)
ENGINE = MergeTree()
PRIMARY KEY (level, function_id, timestamp)
TTL timestamp + INTERVAL 1 WEEK;

-- Create the requests table
CREATE TABLE IF NOT EXISTS requests
(
    function_id String,
    deployment_id String,
    region String,
    bytes_in UInt32,
    bytes_out UInt32,
    cpu_time_micros Nullable(UInt128),
    timestamp DateTime
)
ENGINE = MergeTree()
PRIMARY KEY (function_id, timestamp);
