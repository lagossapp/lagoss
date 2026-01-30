// This is a copy of the file from the `clickhouse-rs` crate with some
// modifications to make the test pass
// https://github.com/loyd/clickhouse.rs/blob/master/src/test/mock.rs
use bytes::Bytes;
use std::{
    convert::Infallible,
    net::SocketAddr,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
    time::Duration,
};

use clickhouse::test::Handler;
use futures::{
    channel::{self, mpsc::UnboundedSender},
    lock::Mutex,
    StreamExt,
};
use http_body_util::{BodyExt, Full};
use hyper::body::Incoming;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use tokio::net::TcpListener;
use tokio::time::timeout;

type HandlerFn = Box<dyn FnOnce(Request<Bytes>) -> Response<Bytes> + Send>;

const MAX_WAIT_TIME: Duration = Duration::from_millis(150);

pub struct Mock {
    url: String,
    tx: UnboundedSender<HandlerFn>,
    responses_left: Arc<AtomicUsize>,
}

impl Mock {
    #[allow(clippy::new_without_default)]
    pub fn new() -> Self {
        let addr = SocketAddr::from(([127, 0, 0, 1], 0));
        let (tx, rx) = channel::mpsc::unbounded::<HandlerFn>();
        let rx = Arc::new(Mutex::new(rx));
        let responses_left = Arc::new(AtomicUsize::new(0));
        let responses_left_clone = responses_left.clone();

        // Spawn the server task
        tokio::spawn(async move {
            // Bind to the address
            let listener = TcpListener::bind(addr).await.expect("failed to bind");
            let local_addr = listener.local_addr().expect("failed to get local addr");

            println!("Mock server listening on {}", local_addr);

            loop {
                // Accept incoming connections
                let (stream, _) = match listener.accept().await {
                    Ok(conn) => conn,
                    Err(e) => {
                        eprintln!("Failed to accept connection: {}", e);
                        continue;
                    }
                };

                let io = TokioIo::new(stream);
                let rx_clone = rx.clone();
                let responses_left_clone = responses_left.clone();

                // Spawn a task to handle this connection
                tokio::spawn(async move {
                    let service = service_fn(move |req: Request<Incoming>| {
                        let rx_inner = rx_clone.clone();
                        let responses_left_inner = responses_left_clone.clone();

                        async move {
                            let (parts, body) = req.into_parts();
                            let bytes = body.collect().await.unwrap().to_bytes();
                            println!(
                                "Mock received request: {:?} body_len={}",
                                parts.uri,
                                bytes.len()
                            );
                            let req = Request::from_parts(parts, bytes);

                            let handler_fn = {
                                let mut rx_locked = rx_inner.lock().await;
                                match timeout(MAX_WAIT_TIME, rx_locked.next()).await {
                                    Ok(Some(handler)) => {
                                        responses_left_inner.fetch_sub(1, Ordering::Relaxed);
                                        handler
                                    }
                                    _ => panic!("unexpected request, no predefined responses left"),
                                }
                            };

                            let res = handler_fn(req);
                            let (parts, body) = res.into_parts();
                            let body = Full::new(body);
                            Ok::<_, Infallible>(Response::from_parts(parts, body))
                        }
                    });

                    if let Err(err) = http1::Builder::new().serve_connection(io, service).await {
                        eprintln!("Error serving connection: {:?}", err);
                    }
                });
            }
        });

        // Give the server a moment to start and bind
        std::thread::sleep(Duration::from_millis(10));

        Self {
            url: format!("http://{addr}"),
            tx,
            responses_left: responses_left_clone,
        }
    }

    pub fn url(&self) -> &str {
        &self.url
    }

    pub fn add<H: Handler>(&self, handler: H) -> H::Control {
        let (h_fn, control) = handler.make();
        self.responses_left.fetch_add(1, Ordering::Relaxed);
        self.tx
            .unbounded_send(h_fn)
            .expect("the test server is down");
        control
    }
}
