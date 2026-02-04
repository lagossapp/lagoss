use crate::Deployment;
use anyhow::Result;
use bytes::Bytes;
use flume::Receiver;
use futures::StreamExt;
use http_body::Frame;
use http_body_util::{combinators::BoxBody, BodyExt, Full, StreamBody};
use hyper::{http::response::Builder, Response};
use lagoss_runtime_http::{RunResult, StreamResult};
use std::{future::Future, sync::Arc};

type ResponseBody = BoxBody<Bytes, std::io::Error>;

pub const PAGE_404: &str = include_str!("../public/404.html");
pub const PAGE_403: &str = include_str!("../public/403.html");
pub const PAGE_502: &str = include_str!("../public/502.html");
pub const PAGE_500: &str = include_str!("../public/500.html");
pub const FAVICON_URL: &str = "/favicon.ico";

#[derive(Debug)]
pub enum ResponseEvent {
    Bytes(usize, Option<u128>),
    UnexpectedStreamResult,
    Timeout,
    MemoryLimit,
    Error(String),
}

const X_ROBOTS_TAGS: &str = "x-robots-tag";

fn build_response(
    response_builder: Builder,
    deployment: &Deployment,
    body: ResponseBody,
) -> Result<Response<ResponseBody>> {
    // We automatically add a X-Robots-Tag: noindex header to
    // all preview deployments to prevent them from being
    // indexed by search engines
    let response_builder = match deployment.is_production {
        true => response_builder,
        false => response_builder.header(X_ROBOTS_TAGS, "noindex"),
    };

    Ok(response_builder.body(body)?)
}

pub async fn handle_response<F>(
    rx: Receiver<RunResult>,
    deployment: Arc<Deployment>,
    on_event: impl FnOnce(ResponseEvent, Response<ResponseBody>) -> F + Send + Sync + 'static,
) -> Result<Response<ResponseBody>>
where
    F: Future<Output = Result<()>> + Send,
{
    let result = rx.recv_async().await?;

    match result {
        RunResult::Stream(stream_result) => {
            let (stream_tx, stream_rx) = flume::unbounded::<Result<Bytes, std::io::Error>>();
            let body = BodyExt::boxed(StreamBody::new(
                stream_rx.into_stream().map(|r| r.map(Frame::data)),
            ));

            let (response_builder_tx, response_builder_rx) = flume::bounded(1);
            let (event_tx, event_rx) = flume::bounded(1);
            let mut total_bytes = 0;

            match stream_result {
                StreamResult::Start(response) => {
                    response_builder_tx.send_async(response).await.unwrap_or(());
                }
                StreamResult::Data(bytes) => {
                    total_bytes += bytes.len();

                    let bytes = Bytes::from(bytes);
                    stream_tx.send_async(Ok(bytes)).await.unwrap_or(());
                }
                StreamResult::Done(_) => {
                    // Close the stream by sending empty bytes
                    stream_tx.send_async(Ok(Bytes::new())).await.unwrap_or(());
                }
            }

            // Spawn a task to handle the rest of the stream, so we can return the response immediately
            tokio::spawn(async move {
                let mut event = None;

                while let Ok(result) = rx.recv_async().await {
                    match result {
                        RunResult::Stream(StreamResult::Start(response_builder)) => {
                            response_builder_tx
                                .send_async(response_builder)
                                .await
                                .unwrap_or(());
                        }
                        RunResult::Stream(StreamResult::Data(bytes)) => {
                            total_bytes += bytes.len();

                            let bytes = Bytes::from(bytes);
                            stream_tx.send_async(Ok(bytes)).await.unwrap_or(());
                        }
                        RunResult::Stream(StreamResult::Done(elapsed)) => {
                            event =
                                Some(ResponseEvent::Bytes(total_bytes, Some(elapsed.as_micros())));

                            // Close the stream by sending empty bytes
                            stream_tx.send_async(Ok(Bytes::new())).await.unwrap_or(());
                            break;
                        }
                        _ => {
                            event = Some(ResponseEvent::UnexpectedStreamResult);

                            // Close the stream by sending empty bytes
                            stream_tx.send_async(Ok(Bytes::new())).await.unwrap_or(());
                            break;
                        }
                    }
                }

                drop(stream_tx);

                if let Some(event) = event {
                    event_tx.send_async(event).await.unwrap_or(());
                }
            });

            let response_builder = response_builder_rx.recv_async().await?;
            let response = build_response(response_builder, &deployment, body)?;

            // Handle the event in a separate task after we've returned the response
            // Pass a response with the same status and headers but empty body
            let event_response = clone_response_without_body(&response);
            tokio::spawn(async move {
                if let Ok(event) = event_rx.recv_async().await {
                    on_event(event, event_response).await.unwrap_or(());
                }
            });

            Ok(response)
        }
        RunResult::Response(response_builder, body, elapsed) => {
            let bytes = body.collect().await?.to_bytes();
            let len = bytes.len();
            let body = Full::new(bytes).map_err(|_| unreachable!()).boxed();
            let response = build_response(response_builder, &deployment, body)?;

            let event = ResponseEvent::Bytes(len, elapsed.map(|duration| duration.as_micros()));
            on_event(event, clone_response_without_body(&response)).await?;

            Ok(response)
        }
        RunResult::Timeout | RunResult::MemoryLimit => {
            let body = Full::new(Bytes::from(PAGE_502))
                .map_err(|_| unreachable!())
                .boxed();
            let response = Response::builder().status(502).body(body)?;

            let event = ResponseEvent::MemoryLimit; // TODO: differentiate timeout and memory limit
            on_event(event, clone_response_without_body(&response)).await?;

            Ok(response)
        }
        RunResult::Error(error) => {
            let body = Full::new(Bytes::from(PAGE_500))
                .map_err(|_| unreachable!())
                .boxed();
            let response = Response::builder().status(500).body(body)?;

            let event = ResponseEvent::Error(error);
            on_event(event, clone_response_without_body(&response)).await?;

            Ok(response)
        }
    }
}

fn clone_response_without_body(response: &Response<ResponseBody>) -> Response<ResponseBody> {
    let mut builder = Response::builder().status(response.status());

    for (key, value) in response.headers() {
        builder = builder.header(key, value);
    }

    builder
        .body(Full::default().map_err(|_| unreachable!()).boxed())
        .unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;
    use hyper::Response;
    use std::time::Duration;

    #[tokio::test]
    async fn sequential() {
        let (tx, rx) = flume::unbounded::<RunResult>();

        let handle = tokio::spawn(async move {
            let deployment = Arc::new(Deployment::default());
            let response = handle_response(rx, deployment, |event, _| async move {
                assert!(matches!(event, ResponseEvent::Bytes(11, None)));

                Ok(())
            })
            .await
            .unwrap();

            assert_eq!(response.status(), 200);
            assert!(response.headers().get(X_ROBOTS_TAGS).is_some());
            assert_eq!(
                response.into_body().collect().await.unwrap().to_bytes(),
                Bytes::from("Hello World")
            );
        });

        tx.send_async(RunResult::Response(
            Builder::new(),
            Full::new(Bytes::from("Hello World")),
            None,
        ))
        .await
        .unwrap();

        handle.await.unwrap();
    }

    #[tokio::test]
    async fn sequential_production() {
        let (tx, rx) = flume::unbounded::<RunResult>();

        let handle = tokio::spawn(async move {
            let deployment = Arc::new(Deployment {
                is_production: true,
                ..Deployment::default()
            });

            let response = handle_response(rx, deployment, |event, _| async move {
                assert!(matches!(event, ResponseEvent::Bytes(11, None)));

                Ok(())
            })
            .await
            .unwrap();

            assert_eq!(response.status(), 200);
            assert!(response.headers().get(X_ROBOTS_TAGS).is_none());
            assert_eq!(
                response.into_body().collect().await.unwrap().to_bytes(),
                Bytes::from("Hello World")
            );
        });

        tx.send_async(RunResult::Response(
            Builder::new(),
            Full::new(Bytes::from("Hello World")),
            None,
        ))
        .await
        .unwrap();

        handle.await.unwrap();
    }

    #[tokio::test]
    async fn stream() {
        let (tx, rx) = flume::unbounded::<RunResult>();

        let handle = tokio::spawn(async move {
            let deployment = Arc::new(Deployment::default());
            let response = handle_response(rx, deployment, |event, _| async move {
                assert!(matches!(event, ResponseEvent::Bytes(11, Some(0))));

                Ok(())
            })
            .await
            .unwrap();

            assert_eq!(response.status(), 200);
            assert!(response.headers().get(X_ROBOTS_TAGS).is_some());
            assert_eq!(
                response.into_body().collect().await.unwrap().to_bytes(),
                Bytes::from("Hello world")
            );
        });

        tx.send_async(RunResult::Stream(StreamResult::Start(Response::builder())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Data(b"Hello".to_vec())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Data(b" world".to_vec())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Done(Duration::from_secs(
            0,
        ))))
        .await
        .unwrap();

        drop(tx);

        handle.await.unwrap();
    }

    #[tokio::test]
    async fn stream_production() {
        let (tx, rx) = flume::unbounded::<RunResult>();

        let handle = tokio::spawn(async move {
            let deployment = Arc::new(Deployment {
                is_production: true,
                ..Deployment::default()
            });

            let response = handle_response(rx, deployment, |event, _| async move {
                assert!(matches!(event, ResponseEvent::Bytes(11, Some(0))));

                Ok(())
            })
            .await
            .unwrap();

            assert_eq!(response.status(), 200);
            assert!(response.headers().get(X_ROBOTS_TAGS).is_none());
            assert_eq!(
                response.into_body().collect().await.unwrap().to_bytes(),
                Bytes::from("Hello world")
            );
        });

        tx.send_async(RunResult::Stream(StreamResult::Start(Response::builder())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Data(b"Hello".to_vec())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Data(b" world".to_vec())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Done(Duration::from_secs(
            0,
        ))))
        .await
        .unwrap();

        drop(tx);

        handle.await.unwrap();
    }

    #[tokio::test]
    async fn stream_data_before_response() {
        let (tx, rx) = flume::unbounded::<RunResult>();

        let handle = tokio::spawn(async move {
            let deployment = Arc::new(Deployment::default());
            let response = handle_response(rx, deployment, |event, _| async move {
                assert!(matches!(event, ResponseEvent::Bytes(11, Some(0))));

                Ok(())
            })
            .await
            .unwrap();

            assert_eq!(response.status(), 200);
            assert!(response.headers().get(X_ROBOTS_TAGS).is_some());
            assert_eq!(
                response.into_body().collect().await.unwrap().to_bytes(),
                Bytes::from("Hello world")
            );
        });

        tx.send_async(RunResult::Stream(StreamResult::Data(b"Hello".to_vec())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Start(Response::builder())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Data(b" world".to_vec())))
            .await
            .unwrap();

        tx.send_async(RunResult::Stream(StreamResult::Done(Duration::from_secs(
            0,
        ))))
        .await
        .unwrap();

        drop(tx);

        handle.await.unwrap();
    }
}
