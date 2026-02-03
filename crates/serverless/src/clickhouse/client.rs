use clickhouse::Client;
use std::env;

fn read_env_var(key: &str) -> String {
    env::var(key).expect(format!("{} env variable has to be set", key).as_str())
}

pub fn get_database_name() -> String {
    read_env_var("CLICKHOUSE_DATABASE")
}

pub async fn create_client() -> Result<Client, anyhow::Error> {
    let url = read_env_var("CLICKHOUSE_URL");
    let user = read_env_var("CLICKHOUSE_USER");

    let mut client = Client::default().with_url(url).with_user(user);

    if let Ok(password) = env::var("CLICKHOUSE_PASSWORD") {
        client = client.with_password(password);
    }

    let database = get_database_name();

    // Ensure the database exists
    client
        .query(format!("CREATE DATABASE IF NOT EXISTS {}", get_database_name()).as_str())
        .execute()
        .await?;

    Ok(client.with_database(database))
}
