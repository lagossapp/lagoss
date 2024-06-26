use anyhow::{anyhow, Result};
use hyper::{body::Bytes, http::request::Parts, Body, Method, Request};
use lagoss_runtime_v8_utils::{
    extract_v8_headers_object, extract_v8_string, v8_headers_object, v8_string,
};

pub fn request_to_v8<'a>(
    request: (Parts, Bytes),
    scope: &mut v8::HandleScope<'a>,
) -> v8::Local<'a, v8::Object> {
    let body_empty = request.1.is_empty();
    let len = if body_empty { 3 } else { 4 };

    let mut names = Vec::with_capacity(len);
    let mut values = Vec::with_capacity(len);

    let host = request
        .0
        .headers
        .get("host")
        .map_or("", |host| host.to_str().unwrap_or(""));
    let uri = request.0.uri.to_string();
    let uri = uri.as_str();

    let mut url = String::with_capacity(8 + host.len() + uri.len());
    url.push_str("https://");
    url.push_str(host);
    url.push_str(uri);

    let method = request.0.method.as_str();

    names.push(v8_string(scope, "i").into());
    values.push(v8_string(scope, &url).into());

    names.push(v8_string(scope, "m").into());
    values.push(v8_string(scope, method).into());

    if !body_empty {
        names.push(v8_string(scope, "b").into());
        values.push(v8_string(scope, unsafe { std::str::from_utf8_unchecked(&request.1) }).into());
    }

    names.push(v8_string(scope, "h").into());
    values.push(v8_headers_object(scope, request.0.headers).into());

    let null = v8::null(scope);
    v8::Object::with_prototype_and_properties(scope, null.into(), &names, &values)
}

pub fn request_from_v8<'a>(
    scope: &mut v8::HandleScope<'a>,
    request: v8::Local<'a, v8::Value>,
) -> Result<Request<Body>> {
    let request = match request.to_object(scope) {
        Some(request) => request,
        None => return Err(anyhow!("Request is not an object")),
    };

    let mut request_builder = Request::builder();

    let mut body = Body::empty();
    let body_key = v8_string(scope, "b");

    if let Some(body_value) = request.get(scope, body_key.into()) {
        if !body_value.is_null_or_undefined() {
            body = Body::from(extract_v8_string(body_value, scope)?);
        }
    }

    let headers_key = v8_string(scope, "h");

    if let Some(headers_value) = request.get(scope, headers_key.into()) {
        if !headers_value.is_null_or_undefined() {
            let headers_map = request_builder.headers_mut().unwrap();
            extract_v8_headers_object(headers_map, headers_value, scope)?;
        }
    }

    let mut method = Method::GET;
    let method_key = v8_string(scope, "m");

    if let Some(method_value) = request.get(scope, method_key.into()) {
        method = Method::from_bytes(extract_v8_string(method_value, scope)?.as_bytes())?;
    }

    let url;
    let url_key = v8_string(scope, "u");

    if let Some(url_value) = request.get(scope, url_key.into()) {
        url = extract_v8_string(url_value, scope)?;
    } else {
        return Err(anyhow!("Could not find url"));
    }

    Ok(request_builder.method(method).uri(url).body(body)?)
}
