use anyhow::Result;
use clickhouse::Client;
use log::info;

/// Migration struct containing SQL and metadata
pub struct Migration {
    pub version: u32,
    pub name: &'static str,
    pub sql: &'static str,
}

/// List of all migrations in order
pub const MIGRATIONS: &[Migration] = &[Migration {
    version: 1,
    name: "initial_schema",
    sql: include_str!("../../migrations/001_initial_schema.sql"),
}];

/// Create the migrations tracking table
async fn create_migrations_table(client: &Client) -> Result<()> {
    client
        .query(
            "CREATE TABLE IF NOT EXISTS schema_migrations
(
    version UInt32,
    name String,
    applied_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
ORDER BY version",
        )
        .execute()
        .await?;

    Ok(())
}

/// Get the current schema version
async fn get_current_version(client: &Client) -> Result<u32> {
    #[derive(clickhouse::Row, serde::Deserialize)]
    struct MaxVersion {
        max_version: u32,
    }

    let result: Vec<MaxVersion> = client
        .query("SELECT max(version) as max_version FROM schema_migrations")
        .fetch_all()
        .await?;

    Ok(result.first().map(|v| v.max_version).unwrap_or(0))
}

/// Execute a single migration
async fn execute_migration(client: &Client, migration: &Migration) -> Result<()> {
    info!(
        "Running migration {} - {}",
        migration.version, migration.name
    );

    let sql_without_comments = migration
        .sql
        .lines()
        .filter(|line| !line.trim_start().starts_with("--"))
        .collect::<Vec<&str>>()
        .join("\n");

    // Split by semicolon and execute each statement
    for statement in sql_without_comments.split(';') {
        let statement = statement.trim();
        if statement.is_empty() {
            continue;
        }

        client.query(statement).execute().await.or_else(|e| {
            Err(anyhow::anyhow!(
                "Failed to execute migration {} - {}: {}\nStatement: {}",
                migration.version,
                migration.name,
                e,
                statement
            ))
        })?;
    }

    // Record the migration
    client
        .query("INSERT INTO schema_migrations (version, name) VALUES (?, ?)")
        .bind(migration.version)
        .bind(migration.name)
        .execute()
        .await?;

    info!(
        "Completed migration {} - {}",
        migration.version, migration.name
    );

    Ok(())
}

/// Run all pending migrations
pub async fn run_migrations(client: &Client) -> Result<()> {
    // Create the migrations tracking table
    create_migrations_table(client).await?;

    // Get the current version
    let current_version = get_current_version(client).await?;

    info!("Current schema version: {}", current_version);

    // Run pending migrations
    let mut applied_count = 0;
    for migration in MIGRATIONS {
        if migration.version > current_version {
            execute_migration(client, migration).await?;
            applied_count += 1;
        }
    }

    if applied_count > 0 {
        info!("Applied {} migration(s)", applied_count);
    } else {
        info!("Database schema is up to date");
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_migrations_are_ordered() {
        for i in 0..MIGRATIONS.len() {
            assert_eq!(
                MIGRATIONS[i].version as usize,
                i + 1,
                "Migration {} has incorrect version number",
                MIGRATIONS[i].name
            );
        }
    }

    #[test]
    fn test_migrations_have_unique_names() {
        let mut names = std::collections::HashSet::new();
        for migration in MIGRATIONS {
            assert!(
                names.insert(migration.name),
                "Duplicate migration name: {}",
                migration.name
            );
        }
    }

    #[test]
    fn test_migration_sql_not_empty() {
        for migration in MIGRATIONS {
            assert!(
                !migration.sql.trim().is_empty(),
                "Migration {} has empty SQL",
                migration.name
            );
        }
    }
}
