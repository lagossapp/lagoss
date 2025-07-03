use super::Config;
use anyhow::{anyhow, Result};
use reqwest::{Client, ClientBuilder};
use serde::{de::DeserializeOwned, Serialize};

pub struct ApiClient {
    pub client: Client,
    config: Config,
}

impl ApiClient {
    pub fn new(config: Config) -> Self {
        let client = ClientBuilder::new().use_rustls_tls().build().unwrap();
        Self { client, config }
    }

    async fn request<T, R>(&self, method: &str, url: &str, body: Option<T>) -> Result<R>
    where
        T: Serialize,
        R: DeserializeOwned,
    {
        let mut builder = self
            .client
            .request(
                method.parse()?,
                format!("{}{}", self.config.site_url.clone(), url),
            )
            .header("content-type", "application/json")
            .header("x-lagoss-token", self.config.token.as_ref().unwrap());

        if let Some(body) = body {
            let body: String = serde_json::to_string(&body)?;
            builder = builder.body(body);
        }

        let response = builder.send().await?;
        let status = response.status();
        let body = response.text().await?;

        match status.is_success() {
            true => match serde_json::from_str::<R>(&body) {
                Ok(response) => Ok(response),
                // TODO: drop TrpcErrorResult
                Err(_) => Err(anyhow!("Failed to deserialize response: {}", body)),
            },
            false => Err(anyhow!("Request failed with status: {}", status)),
        }
    }

    pub async fn get<R>(&self, url: &str) -> Result<R>
    where
        R: DeserializeOwned,
    {
        self.request("GET", url, None::<()>).await
    }

    pub async fn post<T, R>(&self, url: &str, body: T) -> Result<R>
    where
        T: Serialize,
        R: DeserializeOwned,
    {
        self.request("POST", url, Some(body)).await
    }

    pub async fn delete<R>(&self, url: &str) -> Result<R>
    where
        R: DeserializeOwned,
    {
        self.request("DELETE", url, None::<()>).await
    }
}
