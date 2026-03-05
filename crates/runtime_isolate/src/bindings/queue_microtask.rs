use lagoss_runtime_v8_utils::v8_exception;

pub fn queue_microtask_binding(
    scope: &mut v8::PinScope<'_, '_>,
    args: v8::FunctionCallbackArguments,
    mut _retval: v8::ReturnValue,
) {
    let value = args.get(0);

    if !value.is_function() {
        let exception = v8_exception(scope, "Parameter 1 is not of type 'Function'");
        scope.throw_exception(exception);
    }

    let function: v8::Local<v8::Function> = value.cast();
    scope.enqueue_microtask(function);
}
