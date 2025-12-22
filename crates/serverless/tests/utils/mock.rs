// This is a copy of the file from the `clickhouse-rs` crate with some
// modifications to make the test pass
// https://github.com/loyd/clickhouse.rs/blob/master/src/test/mock.rs
use std::{
    convert::Infallible,
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
use hyper::body::Bytes;
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
        let (tx, rx) = channel::mpsc::unbounded::<HandlerFn>();
        let rx = Arc::new(Mutex::new(rx));
        let responses_left = Arc::new(AtomicUsize::new(0));
        let responses_left_0 = responses_left.clone();

        let (addr_tx, addr_rx) = std::sync::mpsc::channel();

        // Spawn the server in a background task
        tokio::spawn(async move {
            let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
            addr_tx.send(listener.local_addr().unwrap()).unwrap();

            loop {
                let (stream, _) = match listener.accept().await {
                    Ok(s) => s,
                    Err(_) => continue,
                };
                let io = TokioIo::new(stream);

                let rx = rx.clone();
                let responses_left = responses_left.clone();

                tokio::task::spawn(async move {
                    let service = service_fn(move |req: Request<hyper::body::Incoming>| {
                        let rx = rx.clone();
                        let responses_left = responses_left.clone();
                        async move {
                            let (parts, body) = req.into_parts();
                            let bytes = body.collect().await.unwrap().to_bytes();
                            let req = Request::from_parts(parts, bytes);

                            let handler_fn = {
                                let mut rx = rx.lock().await;

                                // TODO: should we use `std::time::Instant` instead?
                                match timeout(MAX_WAIT_TIME, rx.next()).await {
                                    Ok(Some(res)) => {
                                        responses_left.fetch_sub(1, Ordering::Relaxed);
                                        res
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

                    if let Err(err) = hyper::server::conn::http1::Builder::new()
                        .serve_connection(io, service)
                        .await
                    {
                        eprintln!("Error serving connection: {:?}", err);
                    }
                });
            }
        });

        let addr = addr_rx.recv().unwrap();

        Self {
            url: format!("http://{addr}"),
            tx,
            responses_left: responses_left_0,
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
