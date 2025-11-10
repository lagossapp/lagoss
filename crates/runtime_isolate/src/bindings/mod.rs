use crate::Isolate;
use bytes::Bytes;
use compression::{
    compression_create_binding, compression_finish_binding, compression_write_binding,
};
use console::console_binding;
use crypto::{
    decrypt_binding, decrypt_init, digest_binding, encrypt_binding, encrypt_init,
    get_key_value_binding, random_values_binding, sign_binding, sign_init, uuid_binding,
    verify_binding, verify_init,
};
use crypto::{
    derive_bits_binding, derive_bits_init, digest_init, generate_key_binding, generate_key_init,
};
use fetch::{fetch_binding, fetch_init};
use http::HeaderMap;
use lagoss_runtime_http::response_to_v8;
use lagoss_runtime_v8_utils::{v8_boolean, v8_string, v8_uint8array};
use pull_stream::pull_stream_binding;
use queue_microtask::queue_microtask_binding;
use sleep::{sleep_binding, sleep_init};

pub mod compression;
pub mod console;
pub mod crypto;
pub mod fetch;
pub mod pull_stream;
pub mod queue_microtask;
pub mod sleep;

pub struct BindingResult {
    pub id: usize,
    pub result: PromiseResult,
}

pub enum PromiseResult {
    Response((u16, HeaderMap, Bytes)),
    ArrayBuffer(Vec<u8>),
    Boolean(bool),
    Error(String),
    Undefined,
}

impl PromiseResult {
    pub fn into_value<'a>(self, scope: &mut v8::HandleScope<'a>) -> v8::Local<'a, v8::Value> {
        match self {
            PromiseResult::Response(response) => response_to_v8(response, scope).into(),
            PromiseResult::ArrayBuffer(bytes) => v8_uint8array(scope, bytes).into(),
            PromiseResult::Boolean(boolean) => v8_boolean(scope, boolean).into(),
            PromiseResult::Error(error) => v8_string(scope, &error).into(),
            PromiseResult::Undefined => v8::undefined(scope).into(),
        }
    }
}

#[derive(PartialEq, Eq, Debug)]
pub enum BindStrategy {
    All,
    Sync,
    Async,
}

macro_rules! binding {
    ($scope: ident, $lagoss_object: ident, $name: literal, $binding: ident) => {
        $lagoss_object.set(
            v8_string($scope, $name).into(),
            v8::FunctionTemplate::new($scope, $binding).into(),
        );
    };
}

macro_rules! async_binding {
    ($scope: ident, $lagoss_object: ident, $name: literal, $init: expr, $binding: expr) => {
        let binding = |scope: &mut v8::HandleScope,
                       args: v8::FunctionCallbackArguments,
                       mut retval: v8::ReturnValue| {
            let promise = v8::PromiseResolver::new(scope).unwrap();
            retval.set(promise.into());

            let isolate_state = Isolate::state(scope);
            let mut state = isolate_state.borrow_mut();
            let id = state.js_promises.len() + 1;

            let global_promise = v8::Global::new(scope, promise);
            state.js_promises.insert(id, global_promise);

            // Drop the state so we can borrow
            // it mutably inside init()
            drop(state);

            match $init(scope, args) {
                Ok(args) => {
                    let future = $binding(id, args);

                    isolate_state.borrow_mut().promises.push(Box::pin(future));
                }
                Err(error) => {
                    let error = v8_string(scope, &error.to_string());
                    promise.reject(scope, error.into());
                }
            }
        };

        $lagoss_object.set(
            v8_string($scope, $name).into(),
            v8::FunctionTemplate::new($scope, binding).into(),
        );
    };
}

pub fn bind<'a>(
    scope: &mut v8::HandleScope<'a, ()>,
    bind_strategy: BindStrategy,
) -> v8::Local<'a, v8::Context> {
    let global = v8::ObjectTemplate::new(scope);

    let lagoss_object = v8::ObjectTemplate::new(scope);

    if bind_strategy == BindStrategy::All || bind_strategy == BindStrategy::Sync {
        binding!(scope, lagoss_object, "log", console_binding);
        binding!(scope, lagoss_object, "pullStream", pull_stream_binding);
        binding!(scope, lagoss_object, "uuid", uuid_binding);
        binding!(scope, lagoss_object, "randomValues", random_values_binding);
        binding!(scope, lagoss_object, "getKeyValue", get_key_value_binding);
        binding!(
            scope,
            lagoss_object,
            "queueMicrotask",
            queue_microtask_binding
        );

        binding!(
            scope,
            lagoss_object,
            "compressionCreate",
            compression_create_binding
        );

        binding!(
            scope,
            lagoss_object,
            "compressionWrite",
            compression_write_binding
        );

        binding!(
            scope,
            lagoss_object,
            "compressionFinish",
            compression_finish_binding
        );

        global.set(v8_string(scope, "LagossSync").into(), lagoss_object.into());
    }

    if bind_strategy == BindStrategy::All || bind_strategy == BindStrategy::Async {
        let lagoss_object = v8::ObjectTemplate::new(scope);

        async_binding!(scope, lagoss_object, "fetch", fetch_init, fetch_binding);
        async_binding!(scope, lagoss_object, "sign", sign_init, sign_binding);
        async_binding!(scope, lagoss_object, "verify", verify_init, verify_binding);
        async_binding!(scope, lagoss_object, "digest", digest_init, digest_binding);
        async_binding!(
            scope,
            lagoss_object,
            "deriveBits",
            derive_bits_init,
            derive_bits_binding
        );
        async_binding!(
            scope,
            lagoss_object,
            "encrypt",
            encrypt_init,
            encrypt_binding
        );
        async_binding!(
            scope,
            lagoss_object,
            "decrypt",
            decrypt_init,
            decrypt_binding
        );
        async_binding!(scope, lagoss_object, "sleep", sleep_init, sleep_binding);
        async_binding!(
            scope,
            lagoss_object,
            "generateKey",
            generate_key_init,
            generate_key_binding
        );

        global.set(v8_string(scope, "LagossAsync").into(), lagoss_object.into());
    }

    v8::Context::new_from_template(scope, global)
}
