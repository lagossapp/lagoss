-- Migration 003: Rename function_id to app_id
-- We need to recreate tables as we cannot rename key columns directly
-- Issue: https://github.com/ClickHouse/ClickHouse/issues/39887

-- Rename function_id to app_id in logs table
-- ALTER TABLE logs
--     RENAME COLUMN function_id TO app_id;
CREATE TABLE IF NOT EXISTS logs_new
(
    app_id String,
    deployment_id String,
    level String,
    message String,
    region String,
    timestamp DateTime,
    request_id String
)
ENGINE = MergeTree()
PRIMARY KEY (level, app_id, timestamp)
TTL timestamp + INTERVAL 1 WEEK;

INSERT INTO logs_new (app_id, deployment_id, level, message, region, timestamp, request_id)
    SELECT function_id AS app_id, deployment_id, level, message, region, timestamp, request_id
    FROM logs;

DROP TABLE logs;
RENAME TABLE logs_new TO logs;

-- Rename function_id to app_id in requests table
-- ALTER TABLE requests
--     RENAME COLUMN function_id TO app_id;
CREATE TABLE IF NOT EXISTS requests_new
(
    id String,
    app_id String,
    deployment_id String,
    region String,
    bytes_in UInt32,
    bytes_out UInt32,
    cpu_time_micros Nullable(UInt128),
    response_status_code UInt16,
    url String,
    http_method String,
    timestamp DateTime
)
ENGINE = MergeTree()
PRIMARY KEY (app_id, timestamp);

INSERT INTO requests_new (id, app_id, deployment_id, region, bytes_in, bytes_out, cpu_time_micros, response_status_code, url, http_method, timestamp)
    SELECT id, function_id AS app_id, deployment_id, region, bytes_in, bytes_out, cpu_time_micros, response_status_code, url, http_method, timestamp
    FROM requests;

DROP TABLE requests;
RENAME TABLE requests_new TO requests;