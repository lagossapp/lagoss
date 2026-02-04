-- Migration 002: Add missing fields to tables
-- Add request_id to logs table
ALTER TABLE logs
    ADD COLUMN IF NOT EXISTS request_id String AFTER timestamp;

-- Add id, response_status_code, url, and http_method to requests table
ALTER TABLE requests
    ADD COLUMN IF NOT EXISTS id String FIRST;

ALTER TABLE requests
    ADD COLUMN IF NOT EXISTS response_status_code UInt16 AFTER cpu_time_micros;

ALTER TABLE requests
    ADD COLUMN IF NOT EXISTS url String AFTER response_status_code;

ALTER TABLE requests
    ADD COLUMN IF NOT EXISTS http_method String AFTER url;
