Running ../../tools/wpt/fetch/api/headers/header-setcookie.any.js
TEST DONE 0 Headers.prototype.get combines set-cookie headers in order
TEST DONE 0 Headers iterator does not combine set-cookie headers
TEST DONE 0 Headers iterator does not special case set-cookie2 headers
TEST DONE 0 Headers iterator does not combine set-cookie & set-cookie2 headers
TEST DONE 0 Headers iterator preserves set-cookie ordering
TEST DONE 0 Headers iterator preserves per header ordering, but sorts keys alphabetically
TEST DONE 0 Headers iterator preserves per header ordering, but sorts keys alphabetically (and ignores value ordering)
TEST DONE 1 Headers iterator is correctly updated with set-cookie changes
TEST DONE 1 Headers iterator is correctly updated with set-cookie changes #2
TEST DONE 0 Headers.prototype.has works for set-cookie
TEST DONE 0 Headers.prototype.append works for set-cookie
TEST DONE 0 Headers.prototype.set works for set-cookie
TEST DONE 0 Headers.prototype.delete works for set-cookie
TEST DONE 0 Headers.prototype.getSetCookie with no headers present
TEST DONE 0 Headers.prototype.getSetCookie with one header
TEST DONE 0 Headers.prototype.getSetCookie with one header created from an object
TEST DONE 0 Headers.prototype.getSetCookie with multiple headers
TEST DONE 0 Headers.prototype.getSetCookie with an empty header
TEST DONE 0 Headers.prototype.getSetCookie with two equal headers
TEST DONE 0 Headers.prototype.getSetCookie ignores set-cookie2 headers
TEST DONE 0 Headers.prototype.getSetCookie preserves header ordering
TEST DONE 1 Adding Set-Cookie headers normalizes their value
TEST DONE 1 Adding invalid Set-Cookie headers throws
TEST DONE 1 Set-Cookie is a forbidden response header
Skipping ../../tools/wpt/fetch/api/headers/header-values-normalize.any.js
Running ../../tools/wpt/fetch/api/headers/header-values.any.js
TEST DONE 1 XMLHttpRequest with value x%00x needs to throw
TEST DONE 1 XMLHttpRequest with value x%0Ax needs to throw
TEST DONE 1 XMLHttpRequest with value x%0Dx needs to throw
TEST DONE 1 XMLHttpRequest with all valid values
TEST DONE 1 fetch() with value x%00x needs to throw
TEST DONE 1 fetch() with value x%0Ax needs to throw
TEST DONE 1 fetch() with value x%0Dx needs to throw
TEST DONE 1 fetch() with all valid values
Running ../../tools/wpt/fetch/api/headers/headers-basic.any.js
TEST DONE 0 Create headers from no parameter
TEST DONE 0 Create headers from undefined parameter
TEST DONE 0 Create headers from empty object
TEST DONE 0 Create headers with null should throw
TEST DONE 0 Create headers with 1 should throw
TEST DONE 0 Create headers with sequence
TEST DONE 0 Create headers with record
TEST DONE 0 Create headers with existing headers
TEST DONE 1 Create headers with existing headers with custom iterator
TEST DONE 0 Check append method
TEST DONE 0 Check set method
TEST DONE 0 Check has method
TEST DONE 0 Check delete method
TEST DONE 0 Check get method
TEST DONE 1 Check keys method
TEST DONE 1 Check values method
TEST DONE 1 Check entries method
TEST DONE 0 Check Symbol.iterator method
TEST DONE 0 Check forEach method
TEST DONE 1 Iteration skips elements removed while iterating
TEST DONE 1 Removing elements already iterated over causes an element to be skipped during iteration
TEST DONE 1 Appending a value pair during iteration causes it to be reached during iteration
TEST DONE 1 Prepending a value pair before the current element position causes it to be skipped during iteration and adds the current element a second time
Running ../../tools/wpt/fetch/api/headers/headers-casing.any.js
TEST DONE 0 Create headers, names use characters with different case
TEST DONE 0 Check append method, names use characters with different case
TEST DONE 0 Check set method, names use characters with different case
TEST DONE 0 Check delete method, names use characters with different case
Running ../../tools/wpt/fetch/api/headers/headers-combine.any.js
TEST DONE 0 Create headers using same name for different values
TEST DONE 0 Check delete and has methods when using same name for different values
TEST DONE 0 Check set methods when called with already used name
TEST DONE 0 Check append methods when called with already used name
TEST DONE 0 Iterate combined values
TEST DONE 0 Iterate combined values in sorted order
Running ../../tools/wpt/fetch/api/headers/headers-errors.any.js
TEST DONE 0 Create headers giving an array having one string as init argument
TEST DONE 0 Create headers giving an array having three strings as init argument
TEST DONE 1 Create headers giving bad header name as init argument
TEST DONE 1 Create headers giving bad header value as init argument
TEST DONE 1 Check headers get with an invalid name invalidĀ
TEST DONE 0 Check headers get with an invalid name [object Object]
TEST DONE 1 Check headers delete with an invalid name invalidĀ
TEST DONE 0 Check headers delete with an invalid name [object Object]
TEST DONE 1 Check headers has with an invalid name invalidĀ
TEST DONE 0 Check headers has with an invalid name [object Object]
TEST DONE 1 Check headers set with an invalid name invalidĀ
TEST DONE 0 Check headers set with an invalid name [object Object]
TEST DONE 1 Check headers set with an invalid value invalidĀ
TEST DONE 1 Check headers append with an invalid name invalidĀ
TEST DONE 1 Check headers append with an invalid name [object Object]
TEST DONE 1 Check headers append with an invalid value invalidĀ
TEST DONE 0 Headers forEach throws if argument is not callable
TEST DONE 0 Headers forEach loop should stop if callback is throwing exception
Running ../../tools/wpt/fetch/api/headers/headers-no-cors.any.js
TEST DONE 1 "no-cors" Headers object cannot have accept set to sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss, , sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
TEST DONE 1 "no-cors" Headers object cannot have accept-language set to sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss, , sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
TEST DONE 1 "no-cors" Headers object cannot have content-language set to sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss, , sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
TEST DONE 1 "no-cors" Headers object cannot have accept set to , sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
TEST DONE 1 "no-cors" Headers object cannot have accept-language set to , sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
TEST DONE 1 "no-cors" Headers object cannot have content-language set to , sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
TEST DONE 1 "no-cors" Headers object cannot have content-type set to text/plain;ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss, text/plain
TEST DONE 1 Loading data…
Running ../../tools/wpt/fetch/api/headers/headers-normalize.any.js
TEST DONE 1 Create headers with not normalized values
TEST DONE 1 Check append method with not normalized values
TEST DONE 1 Check set method with not normalized values
Running ../../tools/wpt/fetch/api/headers/headers-record.any.js
TEST DONE 0 Passing nothing to Headers constructor
TEST DONE 0 Passing undefined to Headers constructor
TEST DONE 0 Passing null to Headers constructor
TEST DONE 1 Basic operation with one property
TEST DONE 1 Basic operation with one property and a proto
TEST DONE 1 Correct operation ordering with two properties
TEST DONE 1 Correct operation ordering with two properties one of which has an invalid name
TEST DONE 1 Correct operation ordering with two properties one of which has an invalid value
TEST DONE 1 Correct operation ordering with non-enumerable properties
TEST DONE 1 Correct operation ordering with undefined descriptors
TEST DONE 1 Correct operation ordering with repeated keys
TEST DONE 1 Basic operation with Symbol keys
TEST DONE 1 Operation with non-enumerable Symbol keys
Running ../../tools/wpt/fetch/api/headers/headers-structure.any.js
TEST DONE 0 Headers has append method
TEST DONE 0 Headers has delete method
TEST DONE 0 Headers has get method
TEST DONE 0 Headers has has method
TEST DONE 0 Headers has set method
TEST DONE 0 Headers has entries method
TEST DONE 0 Headers has keys method
TEST DONE 0 Headers has values method
Running ../../tools/wpt/fetch/api/body/formdata.any.js
TEST DONE 0 Consume empty response.formData() as FormData
TEST DONE 0 Consume empty request.formData() as FormData
TEST DONE 1 Consume multipart/form-data headers case-insensitively
Running ../../tools/wpt/fetch/api/body/mime-type.any.js
TEST DONE 0 : overriding explicit Content-Type
TEST DONE 0 : overriding explicit Content-Type
TEST DONE 0 : removing implicit Content-Type
TEST DONE 0 : removing implicit Content-Type
TEST DONE 0 : setting missing Content-Type
TEST DONE 0 : setting missing Content-Type
TEST DONE 0 : MIME type for Blob from empty body
TEST DONE 0 : MIME type for Blob from empty body
TEST DONE 1 : MIME type for Blob from empty body with Content-Type
TEST DONE 1 : MIME type for Blob from empty body with Content-Type
TEST DONE 0 : MIME type for Blob
TEST DONE 0 : MIME type for Blob
TEST DONE 1 : MIME type for Blob with non-empty type
TEST DONE 1 : MIME type for Blob with non-empty type
TEST DONE 1 : Extract a MIME type with clone
TEST DONE 1 : Extract a MIME type with clone
TEST DONE 0 : Content-Type in headers wins Blob"s type
TEST DONE 0 : Content-Type in headers wins Blob"s type
TEST DONE 0 : setting missing Content-Type in headers and it wins Blob"s type
TEST DONE 0 : setting missing Content-Type in headers and it wins Blob"s type
Running ../../tools/wpt/fetch/api/request/forbidden-method.any.js
TEST DONE 1 Request() with a forbidden method CONNECT must throw.
TEST DONE 1 Request() with a forbidden method TRACE must throw.
TEST DONE 1 Request() with a forbidden method TRACK must throw.
TEST DONE 1 Request() with a forbidden method connect must throw.
TEST DONE 1 Request() with a forbidden method trace must throw.
TEST DONE 1 Request() with a forbidden method track must throw.
Running ../../tools/wpt/fetch/api/request/request-bad-port.any.js
TEST DONE 1 Request on bad port 1 should throw TypeError.
Skipping ../../tools/wpt/fetch/api/request/request-cache-default-conditional.any.js
Skipping ../../tools/wpt/fetch/api/request/request-cache-default.any.js
Skipping ../../tools/wpt/fetch/api/request/request-cache-force-cache.any.js
Skipping ../../tools/wpt/fetch/api/request/request-cache-no-cache.any.js
Skipping ../../tools/wpt/fetch/api/request/request-cache-no-store.any.js
Skipping ../../tools/wpt/fetch/api/request/request-cache-only-if-cached.any.js
Skipping ../../tools/wpt/fetch/api/request/request-cache-reload.any.js
Running ../../tools/wpt/fetch/api/request/request-constructor-init-body-override.any.js
TEST DONE 1 Check that the body of a new request can be overridden when created from an existing Request object
TEST DONE 0 Check that the body of a new request can be duplicated from an existing Request object
Running ../../tools/wpt/fetch/api/request/request-consume-empty.any.js
TEST DONE 0 Consume request's body as text
TEST DONE 0 Consume request's body as blob
TEST DONE 0 Consume request's body as arrayBuffer
TEST DONE 0 Consume request's body as json (error case)
TEST DONE 1 Consume request's body as formData with correct multipart type (error case)
TEST DONE 0 Consume request's body as formData with correct urlencoded type
TEST DONE 1 Consume request's body as formData without correct type (error case)
TEST DONE 0 Consume empty blob request body as arrayBuffer
TEST DONE 0 Consume empty text request body as arrayBuffer
TEST DONE 0 Consume empty blob request body as text
TEST DONE 0 Consume empty text request body as text
TEST DONE 0 Consume empty URLSearchParams request body as text
TEST DONE 0 Consume empty FormData request body as text
TEST DONE 0 Consume empty ArrayBuffer request body as text
Running ../../tools/wpt/fetch/api/request/request-consume.any.js
TEST DONE 0 Consume String request's body as text
TEST DONE 0 Consume String request's body as blob
TEST DONE 0 Consume String request's body as arrayBuffer
TEST DONE 0 Consume String request's body as bytes
TEST DONE 0 Consume String request's body as JSON
TEST DONE 0 Consume ArrayBuffer request's body as text
TEST DONE 0 Consume ArrayBuffer request's body as blob
TEST DONE 0 Consume ArrayBuffer request's body as arrayBuffer
TEST DONE 0 Consume ArrayBuffer request's body as bytes
TEST DONE 0 Consume ArrayBuffer request's body as JSON
TEST DONE 0 Consume Uint8Array request's body as text
TEST DONE 0 Consume Uint8Array request's body as blob
TEST DONE 0 Consume Uint8Array request's body as arrayBuffer
TEST DONE 0 Consume Uint8Array request's body as bytes
TEST DONE 0 Consume Uint8Array request's body as JSON
TEST DONE 1 Consume Int8Array request's body as text
TEST DONE 1 Consume Int8Array request's body as blob
TEST DONE 1 Consume Int8Array request's body as arrayBuffer
TEST DONE 1 Consume Int8Array request's body as bytes
TEST DONE 1 Consume Int8Array request's body as JSON
TEST DONE 1 Consume Float32Array request's body as text
TEST DONE 1 Consume Float32Array request's body as blob
TEST DONE 1 Consume Float32Array request's body as arrayBuffer
TEST DONE 1 Consume Float32Array request's body as bytes
TEST DONE 1 Consume Float32Array request's body as JSON
TEST DONE 1 Consume DataView request's body as text
TEST DONE 1 Consume DataView request's body as blob
TEST DONE 1 Consume DataView request's body as arrayBuffer
TEST DONE 1 Consume DataView request's body as bytes
TEST DONE 1 Consume DataView request's body as JSON
TEST DONE 0 Consume FormData request's body as FormData
TEST DONE 0 Consume blob response's body as blob
TEST DONE 0 Consume blob response's body as text
TEST DONE 0 Consume blob response's body as json
TEST DONE 0 Consume blob response's body as arrayBuffer
TEST DONE 0 Consume blob response's body as bytes
TEST DONE 0 Consume blob response's body as blob (empty blob as input)
TEST DONE 0 Consume JSON from text: '"null"'
TEST DONE 0 Consume JSON from text: '"1"'
TEST DONE 0 Consume JSON from text: '"true"'
TEST DONE 0 Consume JSON from text: '"\"string\""'
TEST DONE 0 Trying to consume bad JSON text as JSON: 'undefined'
TEST DONE 0 Trying to consume bad JSON text as JSON: '{'
TEST DONE 0 Trying to consume bad JSON text as JSON: 'a'
TEST DONE 0 Trying to consume bad JSON text as JSON: '['
Running ../../tools/wpt/fetch/api/request/request-disturbed.any.js
TEST DONE 1 Request's body: initial state
TEST DONE 0 Request without body cannot be disturbed
TEST DONE 1 Check cloning a disturbed request
TEST DONE 0 Check creating a new request from a disturbed request
TEST DONE 1 Request construction failure should not set "bodyUsed"
TEST DONE 1 Check creating a new request with a new body from a disturbed request
TEST DONE 1 Input request used for creating new request became disturbed
TEST DONE 1 Input request used for creating new request became disturbed even if body is not used
TEST DONE 0 Check consuming a disturbed request
Running ../../tools/wpt/fetch/api/request/request-error.any.js
TEST DONE 1 RequestInit's window is not null
TEST DONE 1 Input URL is not valid
TEST DONE 1 Input URL has credentials
TEST DONE 1 RequestInit's mode is navigate
TEST DONE 1 RequestInit's referrer is invalid
TEST DONE 1 RequestInit's method is invalid
TEST DONE 1 RequestInit's method is forbidden
TEST DONE 1 RequestInit's mode is no-cors and method is not simple
TEST DONE 1 RequestInit's cache mode is only-if-cached and mode is not same-origin
TEST DONE 1 Request with cache mode: only-if-cached and fetch mode cors
TEST DONE 1 Request with cache mode: only-if-cached and fetch mode no-cors
TEST DONE 1 Bad referrerPolicy init parameter value
TEST DONE 1 Bad mode init parameter value
TEST DONE 1 Bad credentials init parameter value
TEST DONE 1 Bad cache init parameter value
TEST DONE 1 Bad redirect init parameter value
TEST DONE 0 Untitled
TEST DONE 1 Request should get its content-type from the init request
TEST DONE 0 Request should not get its content-type from the init request if init headers are provided
TEST DONE 1 Request should get its content-type from the body if none is provided
TEST DONE 1 Request should get its content-type from init headers if one is provided
TEST DONE 0 Request with cache mode: only-if-cached and fetch mode: same-origin
Running ../../tools/wpt/fetch/api/request/request-headers.any.js
TEST DONE 0 Adding valid request header "Content-Type: OK"
TEST DONE 0 Adding valid request header "Potato: OK"
TEST DONE 0 Adding valid request header "proxy: OK"
TEST DONE 0 Adding valid request header "proxya: OK"
TEST DONE 0 Adding valid request header "sec: OK"
TEST DONE 0 Adding valid request header "secb: OK"
TEST DONE 0 Adding valid request header "Set-Cookie2: OK"
TEST DONE 0 Adding valid request header "User-Agent: OK"
TEST DONE 1 Adding invalid request header "Accept-Charset: KO"
TEST DONE 1 Adding invalid request header "accept-charset: KO"
TEST DONE 1 Adding invalid request header "ACCEPT-ENCODING: KO"
TEST DONE 1 Adding invalid request header "Accept-Encoding: KO"
TEST DONE 1 Adding invalid request header "Access-Control-Request-Headers: KO"
TEST DONE 1 Adding invalid request header "Access-Control-Request-Method: KO"
TEST DONE 1 Adding invalid request header "Connection: KO"
TEST DONE 1 Adding invalid request header "Content-Length: KO"
TEST DONE 1 Adding invalid request header "Cookie: KO"
TEST DONE 1 Adding invalid request header "Cookie2: KO"
TEST DONE 1 Adding invalid request header "Date: KO"
TEST DONE 1 Adding invalid request header "DNT: KO"
TEST DONE 1 Adding invalid request header "Expect: KO"
TEST DONE 1 Adding invalid request header "Host: KO"
TEST DONE 1 Adding invalid request header "Keep-Alive: KO"
TEST DONE 1 Adding invalid request header "Origin: KO"
TEST DONE 1 Adding invalid request header "Referer: KO"
TEST DONE 1 Adding invalid request header "Set-Cookie: KO"
TEST DONE 1 Adding invalid request header "TE: KO"
TEST DONE 1 Adding invalid request header "Trailer: KO"
TEST DONE 1 Adding invalid request header "Transfer-Encoding: KO"
TEST DONE 1 Adding invalid request header "Upgrade: KO"
TEST DONE 1 Adding invalid request header "Via: KO"
TEST DONE 1 Adding invalid request header "Proxy-: KO"
TEST DONE 1 Adding invalid request header "proxy-a: KO"
TEST DONE 1 Adding invalid request header "Sec-: KO"
TEST DONE 1 Adding invalid request header "sec-b: KO"
TEST DONE 0 Adding valid no-cors request header "Accept: OK"
TEST DONE 0 Adding valid no-cors request header "Accept-Language: OK"
TEST DONE 0 Adding valid no-cors request header "content-language: OK"
TEST DONE 0 Adding valid no-cors request header "content-type: application/x-www-form-urlencoded"
TEST DONE 0 Adding valid no-cors request header "content-type: application/x-www-form-urlencoded;charset=UTF-8"
TEST DONE 0 Adding valid no-cors request header "content-type: multipart/form-data"
TEST DONE 0 Adding valid no-cors request header "content-type: multipart/form-data;charset=UTF-8"
TEST DONE 0 Adding valid no-cors request header "content-TYPE: text/plain"
TEST DONE 0 Adding valid no-cors request header "CONTENT-type: text/plain;charset=UTF-8"
TEST DONE 1 Adding invalid no-cors request header "Content-Type: KO"
TEST DONE 1 Adding invalid no-cors request header "Potato: KO"
TEST DONE 1 Adding invalid no-cors request header "proxy: KO"
TEST DONE 1 Adding invalid no-cors request header "proxya: KO"
TEST DONE 1 Adding invalid no-cors request header "sec: KO"
TEST DONE 1 Adding invalid no-cors request header "secb: KO"
TEST DONE 0 Adding invalid no-cors request header "Empty-Value: "
TEST DONE 1 Check that request constructor is filtering headers provided as init parameter
TEST DONE 1 Check that no-cors request constructor is filtering headers provided as init parameter
TEST DONE 0 Check that no-cors request constructor is filtering headers provided as part of request parameter
TEST DONE 1 Request should get its content-type from the init request
TEST DONE 0 Request should not get its content-type from the init request if init headers are provided
TEST DONE 1 Request should get its content-type from the body if none is provided
TEST DONE 1 Request should get its content-type from init headers if one is provided
TEST DONE 0 Testing request header creations with various objects
TEST DONE 0 Test that Request.headers has the [SameObject] extended attribute
TEST DONE 0 Testing empty Request Content-Type header
Running ../../tools/wpt/fetch/api/request/request-init-002.any.js
TEST DONE 0 Initialize Request with headers values
TEST DONE 0 Initialize Request's body with "undefined", undefined
TEST DONE 0 Initialize Request's body with "null", null
TEST DONE 1 Initialize Request's body with "[object Object]", application/octet-binary
TEST DONE 1 Initialize Request's body with "[object Object]", multipart/form-data
TEST DONE 1 Initialize Request's body with "This is a USVString", text/plain;charset=UTF-8
TEST DONE 1 Initialize Request's body with "hi!", text/plain;charset=UTF-8
TEST DONE 1 Initialize Request's body with "name=value", application/x-www-form-urlencoded;charset=UTF-8
Running ../../tools/wpt/fetch/api/request/request-init-contenttype.any.js
TEST DONE 0 Default Content-Type for Request with empty body
TEST DONE 0 Default Content-Type for Request with Blob body (no type set)
TEST DONE 0 Default Content-Type for Request with Blob body (empty type)
TEST DONE 0 Default Content-Type for Request with Blob body (set type)
TEST DONE 0 Default Content-Type for Request with buffer source body
TEST DONE 0 Default Content-Type for Request with URLSearchParams body
TEST DONE 0 Default Content-Type for Request with string body
TEST DONE 0 Default Content-Type for Request with ReadableStream body
TEST DONE 0 Can override Content-Type for Request with empty body
TEST DONE 0 Can override Content-Type for Request with Blob body (no type set)
TEST DONE 0 Can override Content-Type for Request with Blob body (empty type)
TEST DONE 0 Can override Content-Type for Request with Blob body (set type)
TEST DONE 0 Can override Content-Type for Request with buffer source body
TEST DONE 0 Can override Content-Type for Request with FormData body
TEST DONE 0 Can override Content-Type for Request with URLSearchParams body
TEST DONE 0 Can override Content-Type for Request with string body
TEST DONE 0 Can override Content-Type for Request with ReadableStream body
TEST DONE 1 Default Content-Type for Request with FormData body
Running ../../tools/wpt/fetch/api/request/request-init-priority.any.js
TEST DONE 0 new Request() with a 'high' priority does not throw an error
TEST DONE 0 new Request() with a 'low' priority does not throw an error
TEST DONE 0 new Request() with a 'auto' priority does not throw an error
TEST DONE 1 new Request() throws a TypeError if any of RequestInit's members' values are invalid
TEST DONE 1 fetch() with a 'high' priority completes successfully
Running ../../tools/wpt/fetch/api/request/request-init-stream.any.js
TEST DONE 1 Constructing a Request with a stream holds the original object.
TEST DONE 1 Constructing a Request with a stream on which getReader() is called
TEST DONE 1 Constructing a Request with a stream on which read() is called
TEST DONE 1 Constructing a Request with a Request on which body.getReader() is called
TEST DONE 1 Constructing a Request with a Request on which body.getReader().read() is called
TEST DONE 0 It is OK to omit .duplex when the body is null.
TEST DONE 0 It is OK to omit .duplex when the body is a string.
TEST DONE 0 It is OK to omit .duplex when the body is a Uint8Array.
TEST DONE 0 It is OK to omit .duplex when the body is a Blob.
TEST DONE 1 It is error to omit .duplex when the body is a ReadableStream.
TEST DONE 0 It is OK to set .duplex = 'half' when the body is null.
TEST DONE 0 It is OK to set .duplex = 'half' when the body is a string.
TEST DONE 0 It is OK to set .duplex = 'half' when the body is a Uint8Array.
TEST DONE 0 It is OK to set .duplex = 'half' when the body is a Blob.
TEST DONE 0 It is OK to set .duplex = 'half' when the body is a ReadableStream.
TEST DONE 1 It is error to set .duplex = 'full' when the body is null.
TEST DONE 1 It is error to set .duplex = 'full' when the body is a string.
TEST DONE 1 It is error to set .duplex = 'full' when the body is a Uint8Array.
TEST DONE 1 It is error to set .duplex = 'full' when the body is a Blob.
TEST DONE 1 It is error to set .duplex = 'full' when the body is a ReadableStream.
TEST DONE 0 It is OK to omit duplex when init.body is not given and input.body is given.
TEST DONE 1 Constructing a Request with a stream on which read() and releaseLock() are called
TEST DONE 1 Constructing a Request with a Request on which read() and releaseLock() are called
Running ../../tools/wpt/fetch/api/request/request-keepalive.any.js
TEST DONE 1 keepalive flag
TEST DONE 1 keepalive flag with stream body
Running ../../tools/wpt/fetch/api/request/request-structure.any.js
TEST DONE 0 Request has clone method
TEST DONE 0 Request has arrayBuffer method
TEST DONE 0 Request has blob method
TEST DONE 0 Request has formData method
TEST DONE 0 Request has json method
TEST DONE 0 Request has text method
TEST DONE 1 Check method attribute
TEST DONE 1 Check url attribute
TEST DONE 1 Check headers attribute
TEST DONE 1 Check destination attribute
TEST DONE 1 Check referrer attribute
TEST DONE 1 Check referrerPolicy attribute
TEST DONE 1 Check mode attribute
TEST DONE 1 Check credentials attribute
TEST DONE 1 Check cache attribute
TEST DONE 1 Check redirect attribute
TEST DONE 1 Check integrity attribute
TEST DONE 1 Check isReloadNavigation attribute
TEST DONE 1 Check isHistoryNavigation attribute
TEST DONE 1 Check duplex attribute
TEST DONE 1 Check bodyUsed attribute
TEST DONE 0 Request does not expose priority attribute
TEST DONE 0 Request does not expose internalpriority attribute
TEST DONE 0 Request does not expose blocking attribute
Running ../../tools/wpt/fetch/api/response/json.any.js
TEST DONE 1 Ensure the correct JSON parser is used
TEST DONE 1 Ensure UTF-16 results in an error
Running ../../tools/wpt/fetch/api/response/response-blob-realm.any.js
TEST DONE 1 realm of the Uint8Array from Response bytes()
Skipping ../../tools/wpt/fetch/api/response/response-cancel-stream.any.js
Running ../../tools/wpt/fetch/api/response/response-clone.any.js
TEST DONE 0 Check Response's clone with default values, without body
TEST DONE 0 Check Response's clone has the expected attribute values
TEST DONE 0 Check orginal response's body after cloning
TEST DONE 0 Check cloned response's body
TEST DONE 1 Cannot clone a disturbed response
TEST DONE 1 Cloned responses should provide the same data
TEST DONE 1 Cancelling stream should not affect cloned one
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Int8Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Int16Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Int32Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (ArrayBufferchunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Uint8Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Uint8ClampedArraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Uint16Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Uint32Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (BigInt64Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (BigUint64Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Float16Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Float32Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (Float64Arraychunk)
TEST DONE 1 Check response clone use structureClone for teed ReadableStreams (DataViewchunk)
Running ../../tools/wpt/fetch/api/response/response-consume-empty.any.js
TEST DONE 0 Consume response's body as text
TEST DONE 0 Consume response's body as blob
TEST DONE 0 Consume response's body as arrayBuffer
TEST DONE 0 Consume response's body as json (error case)
TEST DONE 1 Consume response's body as formData with correct multipart type (error case)
TEST DONE 0 Consume response's body as formData with correct urlencoded type
TEST DONE 1 Consume response's body as formData without correct type (error case)
TEST DONE 0 Consume empty blob response body as arrayBuffer
TEST DONE 0 Consume empty text response body as arrayBuffer
TEST DONE 0 Consume empty blob response body as text
TEST DONE 0 Consume empty text response body as text
TEST DONE 0 Consume empty URLSearchParams response body as text
TEST DONE 0 Consume empty FormData response body as text
TEST DONE 0 Consume empty ArrayBuffer response body as text
Running ../../tools/wpt/fetch/api/response/response-consume-stream.any.js
TEST DONE 0 Getting an error Response stream
TEST DONE 0 Getting a redirect Response stream
TEST DONE 1 Read empty text response's body as readableStream
TEST DONE 0 Read empty blob response's body as readableStream
TEST DONE 0 Read blob response's body as readableStream with mode=undefined
TEST DONE 0 Read text response's body as readableStream with mode=undefined
TEST DONE 0 Read URLSearchParams response's body as readableStream with mode=undefined
TEST DONE 1 Read array buffer response's body as readableStream with mode=undefined
TEST DONE 1 Read form data response's body as readableStream with mode=undefined
TEST DONE 1 Read blob response's body as readableStream with mode=byob
TEST DONE 1 Read text response's body as readableStream with mode=byob
TEST DONE 1 Read URLSearchParams response's body as readableStream with mode=byob
TEST DONE 1 Read array buffer response's body as readableStream with mode=byob
TEST DONE 1 Read form data response's body as readableStream with mode=byob
TEST DONE 1 Reading with offset from Response stream
Skipping ../../tools/wpt/fetch/api/response/response-error-from-stream.any.js
Running ../../tools/wpt/fetch/api/response/response-error.any.js
TEST DONE 1 Throws RangeError when responseInit's status is 0
TEST DONE 0 Throws RangeError when responseInit's status is 100
TEST DONE 0 Throws RangeError when responseInit's status is 199
TEST DONE 0 Throws RangeError when responseInit's status is 600
TEST DONE 0 Throws RangeError when responseInit's status is 1000
TEST DONE 1 Throws TypeError when responseInit's statusText is 

TEST DONE 1 Throws TypeError when responseInit's statusText is Ā
TEST DONE 0 Throws TypeError when building a response with body and a body status of 204
TEST DONE 0 Throws TypeError when building a response with body and a body status of 205
TEST DONE 0 Throws TypeError when building a response with body and a body status of 304
Running ../../tools/wpt/fetch/api/response/response-from-stream.any.js
TEST DONE 1 Constructing a Response with a stream on which getReader() is called
TEST DONE 1 Constructing a Response with a stream on which read() is called
TEST DONE 1 Constructing a Response with a stream on which read() and releaseLock() are called
Running ../../tools/wpt/fetch/api/response/response-headers-guard.any.js
TEST DONE 1 Ensure response headers are immutable
Running ../../tools/wpt/fetch/api/response/response-init-001.any.js
TEST DONE 0 Check default value for type attribute
TEST DONE 0 Check default value for url attribute
TEST DONE 0 Check default value for ok attribute
TEST DONE 0 Check default value for status attribute
TEST DONE 0 Check default value for statusText attribute
TEST DONE 0 Check default value for body attribute
TEST DONE 0 Check status init values and associated getter
TEST DONE 0 Check statusText init values and associated getter
TEST DONE 0 Test that Response.headers has the [SameObject] extended attribute
Running ../../tools/wpt/fetch/api/response/response-init-002.any.js
TEST DONE 0 Initialize Response with headers values
TEST DONE 0 Testing null Response body
TEST DONE 0 Initialize Response's body with application/octet-binary
TEST DONE 1 Initialize Response's body with multipart/form-data
TEST DONE 0 Initialize Response's body with application/x-www-form-urlencoded;charset=UTF-8
TEST DONE 0 Initialize Response's body with text/plain;charset=UTF-8
TEST DONE 0 Read Response's body as readableStream
TEST DONE 0 Testing empty Response Content-Type header
Running ../../tools/wpt/fetch/api/response/response-init-contenttype.any.js
TEST DONE 0 Default Content-Type for Response with empty body
TEST DONE 0 Default Content-Type for Response with Blob body (no type set)
TEST DONE 0 Default Content-Type for Response with Blob body (empty type)
TEST DONE 0 Default Content-Type for Response with Blob body (set type)
TEST DONE 0 Default Content-Type for Response with buffer source body
TEST DONE 0 Default Content-Type for Response with URLSearchParams body
TEST DONE 0 Default Content-Type for Response with string body
TEST DONE 0 Default Content-Type for Response with ReadableStream body
TEST DONE 0 Can override Content-Type for Response with empty body
TEST DONE 0 Can override Content-Type for Response with Blob body (no type set)
TEST DONE 0 Can override Content-Type for Response with Blob body (empty type)
TEST DONE 0 Can override Content-Type for Response with Blob body (set type)
TEST DONE 0 Can override Content-Type for Response with buffer source body
TEST DONE 0 Can override Content-Type for Response with FormData body
TEST DONE 0 Can override Content-Type for Response with URLSearchParams body
TEST DONE 0 Can override Content-Type for Response with string body
TEST DONE 0 Can override Content-Type for Response with ReadableStream body
TEST DONE 1 Default Content-Type for Response with FormData body
Running ../../tools/wpt/fetch/api/response/response-static-error.any.js
TEST DONE 0 Check response returned by static method error()
TEST DONE 0 the 'guard' of the Headers instance should be immutable
Running ../../tools/wpt/fetch/api/response/response-static-json.any.js
TEST DONE 0 Throws TypeError when calling static json() with a status of 204
TEST DONE 0 Throws TypeError when calling static json() with a status of 205
TEST DONE 0 Throws TypeError when calling static json() with a status of 304
TEST DONE 0 Check static json() throws when data is not encodable
TEST DONE 0 Check static json() throws when data is circular
TEST DONE 0 Check response returned by static json() with init undefined
TEST DONE 0 Check response returned by static json() with init {"status":400}
TEST DONE 0 Check response returned by static json() with init {"statusText":"foo"}
TEST DONE 0 Check response returned by static json() with init {"headers":{}}
TEST DONE 0 Check response returned by static json() with init {"headers":{"content-type":"foo/bar"}}
TEST DONE 0 Check response returned by static json() with init {"headers":{"x-foo":"bar"}}
TEST DONE 0 Check static json() encodes JSON objects correctly
TEST DONE 0 Check static json() propagates JSON serializer errors
TEST DONE 0 Check response returned by static json() with input 𝌆
TEST DONE 0 Check response returned by static json() with input ��
TEST DONE 0 Check response returned by static json() with input �
Running ../../tools/wpt/fetch/api/response/response-static-redirect.any.js
TEST DONE 0 Check default redirect response
TEST DONE 0 Check response returned by static method redirect(), status = 301
TEST DONE 0 Check response returned by static method redirect(), status = 302
TEST DONE 0 Check response returned by static method redirect(), status = 303
TEST DONE 0 Check response returned by static method redirect(), status = 307
TEST DONE 0 Check response returned by static method redirect(), status = 308
TEST DONE 1 Check error returned when giving invalid url to redirect()
TEST DONE 0 Check error returned when giving invalid status to redirect(), status = 200
TEST DONE 0 Check error returned when giving invalid status to redirect(), status = 309
TEST DONE 0 Check error returned when giving invalid status to redirect(), status = 400
TEST DONE 0 Check error returned when giving invalid status to redirect(), status = 500
Running ../../tools/wpt/fetch/api/response/response-stream-bad-chunk.any.js
TEST DONE 1 ReadableStream with non-Uint8Array chunk passed to Response.arrayBuffer() causes TypeError
TEST DONE 1 ReadableStream with non-Uint8Array chunk passed to Response.blob() causes TypeError
TEST DONE 1 ReadableStream with non-Uint8Array chunk passed to Response.bytes() causes TypeError
TEST DONE 1 ReadableStream with non-Uint8Array chunk passed to Response.formData() causes TypeError
TEST DONE 1 ReadableStream with non-Uint8Array chunk passed to Response.json() causes TypeError
TEST DONE 1 ReadableStream with non-Uint8Array chunk passed to Response.text() causes TypeError
Running ../../tools/wpt/fetch/api/response/response-stream-disturbed-1.any.js
TEST DONE 1 Getting blob after getting the Response body - not disturbed, not locked (body source: fetch)
TEST DONE 1 Getting text after getting the Response body - not disturbed, not locked (body source: fetch)
TEST DONE 1 Getting json after getting the Response body - not disturbed, not locked (body source: fetch)
TEST DONE 1 Getting arrayBuffer after getting the Response body - not disturbed, not locked (body source: fetch)
TEST DONE 0 Getting blob after getting the Response body - not disturbed, not locked (body source: stream)
TEST DONE 0 Getting text after getting the Response body - not disturbed, not locked (body source: stream)
TEST DONE 0 Getting json after getting the Response body - not disturbed, not locked (body source: stream)
TEST DONE 0 Getting arrayBuffer after getting the Response body - not disturbed, not locked (body source: stream)
TEST DONE 0 Getting blob after getting the Response body - not disturbed, not locked (body source: string)
TEST DONE 0 Getting text after getting the Response body - not disturbed, not locked (body source: string)
TEST DONE 0 Getting json after getting the Response body - not disturbed, not locked (body source: string)
TEST DONE 0 Getting arrayBuffer after getting the Response body - not disturbed, not locked (body source: string)
Running ../../tools/wpt/fetch/api/response/response-stream-disturbed-2.any.js
TEST DONE 1 Getting blob after getting a locked Response body (body source: fetch)
TEST DONE 1 Getting text after getting a locked Response body (body source: fetch)
TEST DONE 1 Getting json after getting a locked Response body (body source: fetch)
TEST DONE 1 Getting arrayBuffer after getting a locked Response body (body source: fetch)
TEST DONE 0 Getting blob after getting a locked Response body (body source: stream)
TEST DONE 0 Getting text after getting a locked Response body (body source: stream)
TEST DONE 0 Getting json after getting a locked Response body (body source: stream)
TEST DONE 0 Getting arrayBuffer after getting a locked Response body (body source: stream)
TEST DONE 1 Getting blob after getting a locked Response body (body source: string)
TEST DONE 1 Getting text after getting a locked Response body (body source: string)
TEST DONE 1 Getting json after getting a locked Response body (body source: string)
TEST DONE 1 Getting arrayBuffer after getting a locked Response body (body source: string)
Running ../../tools/wpt/fetch/api/response/response-stream-disturbed-3.any.js
TEST DONE 1 Getting blob after reading the Response body (body source: fetch)
TEST DONE 1 Getting text after reading the Response body (body source: fetch)
TEST DONE 1 Getting json after reading the Response body (body source: fetch)
TEST DONE 1 Getting arrayBuffer after reading the Response body (body source: fetch)
TEST DONE 0 Getting blob after reading the Response body (body source: stream)
TEST DONE 0 Getting text after reading the Response body (body source: stream)
TEST DONE 0 Getting json after reading the Response body (body source: stream)
TEST DONE 0 Getting arrayBuffer after reading the Response body (body source: stream)
TEST DONE 1 Getting blob after reading the Response body (body source: string)
TEST DONE 1 Getting text after reading the Response body (body source: string)
TEST DONE 1 Getting json after reading the Response body (body source: string)
TEST DONE 1 Getting arrayBuffer after reading the Response body (body source: string)
Skipping ../../tools/wpt/fetch/api/response/response-stream-disturbed-4.any.js
Running ../../tools/wpt/fetch/api/response/response-stream-disturbed-5.any.js
TEST DONE 1 Getting a body reader after consuming as blob (body source: fetch)
TEST DONE 1 Getting a body reader after consuming as text (body source: fetch)
TEST DONE 1 Getting a body reader after consuming as json (body source: fetch)
TEST DONE 1 Getting a body reader after consuming as arrayBuffer (body source: fetch)
TEST DONE 1 Getting a body reader after consuming as blob (body source: stream)
TEST DONE 1 Getting a body reader after consuming as text (body source: stream)
TEST DONE 1 Getting a body reader after consuming as json (body source: stream)
TEST DONE 1 Getting a body reader after consuming as arrayBuffer (body source: stream)
TEST DONE 1 Getting a body reader after consuming as blob (body source: string)
TEST DONE 1 Getting a body reader after consuming as text (body source: string)
TEST DONE 1 Getting a body reader after consuming as json (body source: string)
TEST DONE 1 Getting a body reader after consuming as arrayBuffer (body source: string)
Running ../../tools/wpt/fetch/api/response/response-stream-disturbed-6.any.js
TEST DONE 1 A non-closed stream on which read() has been called
TEST DONE 1 A non-closed stream on which cancel() has been called
TEST DONE 1 A closed stream on which read() has been called
TEST DONE 1 An errored stream on which read() has been called
TEST DONE 1 An errored stream on which cancel() has been called
Running ../../tools/wpt/fetch/api/response/response-stream-disturbed-by-pipe.any.js
TEST DONE 1 using pipeTo on Response body should disturb it synchronously
TEST DONE 1 using pipeThrough on Response body should disturb it synchronously
Skipping ../../tools/wpt/fetch/api/response/response-stream-with-broken-then.any.js
Running ../../tools/wpt/url/historical.any.js
TEST DONE 0 searchParams on location object
TEST DONE 1 Setting URL's href attribute and base URLs
TEST DONE 0 URL.domainToASCII should be undefined
TEST DONE 0 URL.domainToUnicode should be undefined
TEST DONE 1 URL: no structured serialize/deserialize support
TEST DONE 1 URLSearchParams: no structured serialize/deserialize support
TEST DONE 0 Constructor only takes strings
Skipping ../../tools/wpt/url/idlharness.any.js
Running ../../tools/wpt/url/url-constructor.any.js
TEST DONE 1 Loading data…
Running ../../tools/wpt/url/url-origin.any.js
TEST DONE 1 Loading data…
Running ../../tools/wpt/url/url-searchparams.any.js
TEST DONE 0 URL.searchParams getter
TEST DONE 0 URL.searchParams updating, clearing
TEST DONE 1 URL.searchParams setter, invalid values
TEST DONE 1 URL.searchParams and URL.search setters, update propagation
Skipping ../../tools/wpt/url/url-setters-stripping.any.js
Skipping ../../tools/wpt/url/url-setters.any.js
Running ../../tools/wpt/url/url-statics-canparse.any.js
TEST DONE 0 URL.canParse(undefined, undefined)
TEST DONE 0 URL.canParse(aaa:b, undefined)
TEST DONE 0 URL.canParse(undefined, aaa:b)
TEST DONE 0 URL.canParse(undefined, https://test:test/)
TEST DONE 0 URL.canParse(aaa:/b, undefined)
TEST DONE 1 URL.canParse(undefined, aaa:/b)
TEST DONE 1 URL.canParse(https://test:test, undefined)
TEST DONE 0 URL.canParse(a, https://b/)
Running ../../tools/wpt/url/url-statics-parse.any.js
TEST DONE 1 URL.parse(undefined, undefined)
TEST DONE 0 URL.parse(aaa:b, undefined)
TEST DONE 1 URL.parse(undefined, aaa:b)
TEST DONE 0 URL.parse(aaa:/b, undefined)
TEST DONE 1 URL.parse(undefined, aaa:/b)
TEST DONE 1 URL.parse(https://test:test, undefined)
TEST DONE 0 URL.parse(a, https://b/)
TEST DONE 0 URL.parse() should return a unique object
Running ../../tools/wpt/url/url-tojson.any.js
TEST DONE 0 Untitled
Running ../../tools/wpt/url/urlencoded-parser.any.js
TEST DONE 0 URLSearchParams constructed with: test
TEST DONE 0 URLSearchParams constructed with: ﻿test=﻿
TEST DONE 0 URLSearchParams constructed with: %EF%BB%BFtest=%EF%BB%BF
TEST DONE 0 URLSearchParams constructed with: %EF%BF%BF=%EF%BF%BF
TEST DONE 1 URLSearchParams constructed with: %FE%FF
TEST DONE 1 URLSearchParams constructed with: %FF%FE
TEST DONE 0 URLSearchParams constructed with: †&†=x
TEST DONE 1 URLSearchParams constructed with: %C2
TEST DONE 1 URLSearchParams constructed with: %C2x
TEST DONE 1 URLSearchParams constructed with: _charset_=windows-1252&test=%C2x
TEST DONE 0 URLSearchParams constructed with: 
TEST DONE 0 URLSearchParams constructed with: a
TEST DONE 0 URLSearchParams constructed with: a=b
TEST DONE 0 URLSearchParams constructed with: a=
TEST DONE 0 URLSearchParams constructed with: =b
TEST DONE 0 URLSearchParams constructed with: &
TEST DONE 0 URLSearchParams constructed with: &a
TEST DONE 0 URLSearchParams constructed with: a&
TEST DONE 0 URLSearchParams constructed with: a&a
TEST DONE 0 URLSearchParams constructed with: a&b&c
TEST DONE 0 URLSearchParams constructed with: a=b&c=d
TEST DONE 0 URLSearchParams constructed with: a=b&c=d&
TEST DONE 0 URLSearchParams constructed with: &&&a=b&&&&c=d&
TEST DONE 0 URLSearchParams constructed with: a=a&a=b&a=c
TEST DONE 1 URLSearchParams constructed with: a==a
TEST DONE 0 URLSearchParams constructed with: a=a+b+c+d
TEST DONE 1 URLSearchParams constructed with: %=a
TEST DONE 1 URLSearchParams constructed with: %a=a
TEST DONE 1 URLSearchParams constructed with: %a_=a
TEST DONE 0 URLSearchParams constructed with: %61=a
TEST DONE 0 URLSearchParams constructed with: %61+%4d%4D=
TEST DONE 1 URLSearchParams constructed with: id=0&value=%
TEST DONE 1 URLSearchParams constructed with: b=%2sf%2a
TEST DONE 1 URLSearchParams constructed with: b=%2%2af%2a
TEST DONE 1 URLSearchParams constructed with: b=%%2a
TEST DONE 0 request.formData() with input: test
TEST DONE 0 response.formData() with input: test
TEST DONE 0 request.formData() with input: ﻿test=﻿
TEST DONE 0 response.formData() with input: ﻿test=﻿
TEST DONE 0 request.formData() with input: %EF%BB%BFtest=%EF%BB%BF
TEST DONE 0 response.formData() with input: %EF%BB%BFtest=%EF%BB%BF
TEST DONE 0 request.formData() with input: %EF%BF%BF=%EF%BF%BF
TEST DONE 0 response.formData() with input: %EF%BF%BF=%EF%BF%BF
TEST DONE 1 request.formData() with input: %FE%FF
TEST DONE 1 response.formData() with input: %FE%FF
TEST DONE 1 request.formData() with input: %FF%FE
TEST DONE 1 response.formData() with input: %FF%FE
TEST DONE 0 request.formData() with input: †&†=x
TEST DONE 0 response.formData() with input: †&†=x
TEST DONE 1 request.formData() with input: %C2
TEST DONE 1 response.formData() with input: %C2
TEST DONE 1 request.formData() with input: %C2x
TEST DONE 1 response.formData() with input: %C2x
TEST DONE 1 request.formData() with input: _charset_=windows-1252&test=%C2x
TEST DONE 1 response.formData() with input: _charset_=windows-1252&test=%C2x
TEST DONE 0 request.formData() with input: 
TEST DONE 0 response.formData() with input: 
TEST DONE 0 request.formData() with input: a
TEST DONE 0 response.formData() with input: a
TEST DONE 0 request.formData() with input: a=b
TEST DONE 0 response.formData() with input: a=b
TEST DONE 0 request.formData() with input: a=
TEST DONE 0 response.formData() with input: a=
TEST DONE 0 request.formData() with input: =b
TEST DONE 0 response.formData() with input: =b
TEST DONE 0 request.formData() with input: &
TEST DONE 0 response.formData() with input: &
TEST DONE 0 request.formData() with input: &a
TEST DONE 0 response.formData() with input: &a
TEST DONE 0 request.formData() with input: a&
TEST DONE 0 response.formData() with input: a&
TEST DONE 0 request.formData() with input: a&a
TEST DONE 0 response.formData() with input: a&a
TEST DONE 0 request.formData() with input: a&b&c
TEST DONE 0 response.formData() with input: a&b&c
TEST DONE 0 request.formData() with input: a=b&c=d
TEST DONE 0 response.formData() with input: a=b&c=d
TEST DONE 0 request.formData() with input: a=b&c=d&
TEST DONE 0 response.formData() with input: a=b&c=d&
TEST DONE 0 request.formData() with input: &&&a=b&&&&c=d&
TEST DONE 0 response.formData() with input: &&&a=b&&&&c=d&
TEST DONE 0 request.formData() with input: a=a&a=b&a=c
TEST DONE 0 response.formData() with input: a=a&a=b&a=c
TEST DONE 1 request.formData() with input: a==a
TEST DONE 1 response.formData() with input: a==a
TEST DONE 0 request.formData() with input: a=a+b+c+d
TEST DONE 0 response.formData() with input: a=a+b+c+d
TEST DONE 1 request.formData() with input: %=a
TEST DONE 1 response.formData() with input: %=a
TEST DONE 1 request.formData() with input: %a=a
TEST DONE 1 response.formData() with input: %a=a
TEST DONE 1 request.formData() with input: %a_=a
TEST DONE 1 response.formData() with input: %a_=a
TEST DONE 0 request.formData() with input: %61=a
TEST DONE 0 response.formData() with input: %61=a
TEST DONE 0 request.formData() with input: %61+%4d%4D=
TEST DONE 0 response.formData() with input: %61+%4d%4D=
TEST DONE 1 request.formData() with input: id=0&value=%
TEST DONE 1 response.formData() with input: id=0&value=%
TEST DONE 1 request.formData() with input: b=%2sf%2a
TEST DONE 1 response.formData() with input: b=%2sf%2a
TEST DONE 1 request.formData() with input: b=%2%2af%2a
TEST DONE 1 response.formData() with input: b=%2%2af%2a
TEST DONE 1 request.formData() with input: b=%%2a
TEST DONE 1 response.formData() with input: b=%%2a
Running ../../tools/wpt/url/urlsearchparams-append.any.js
TEST DONE 0 Append same name
TEST DONE 0 Append empty strings
TEST DONE 0 Append null
TEST DONE 0 Append multiple
Running ../../tools/wpt/url/urlsearchparams-constructor.any.js
TEST DONE 1 Basic URLSearchParams construction
TEST DONE 0 URLSearchParams constructor, no arguments
TEST DONE 0 URLSearchParams constructor, remove leading "?"
TEST DONE 1 URLSearchParams constructor, DOMException as argument
TEST DONE 0 URLSearchParams constructor, empty string as argument
TEST DONE 0 URLSearchParams constructor, {} as argument
TEST DONE 1 URLSearchParams constructor, string.
TEST DONE 1 URLSearchParams constructor, object.
TEST DONE 1 URLSearchParams constructor, FormData.
TEST DONE 0 Parse +
TEST DONE 0 Parse encoded +
TEST DONE 0 Parse space
TEST DONE 0 Parse %20
TEST DONE 0 Parse \0
TEST DONE 0 Parse %00
TEST DONE 0 Parse ⎄
TEST DONE 0 Parse %e2%8e%84
TEST DONE 0 Parse 💩
TEST DONE 0 Parse %f0%9f%92%a9
TEST DONE 0 Constructor with sequence of sequences of strings
TEST DONE 0 Construct with object with +
TEST DONE 0 Construct with object with two keys
TEST DONE 0 Construct with array with two keys
TEST DONE 1 Construct with 2 unpaired surrogates (no trailing)
TEST DONE 1 Construct with 3 unpaired surrogates (no leading)
TEST DONE 1 Construct with object with NULL, non-ASCII, and surrogate keys
TEST DONE 1 Custom [Symbol.iterator]
Running ../../tools/wpt/url/urlsearchparams-delete.any.js
TEST DONE 0 Delete basics
TEST DONE 0 Deleting appended multiple
TEST DONE 0 Deleting all params removes ? from URL
TEST DONE 0 Removing non-existent param removes ? from URL
TEST DONE 1 Changing the query of a URL with an opaque path with trailing spaces
TEST DONE 1 Changing the query of a URL with an opaque path with trailing spaces and a fragment
TEST DONE 1 Two-argument delete()
TEST DONE 1 Two-argument delete() respects undefined as second arg
Running ../../tools/wpt/url/urlsearchparams-foreach.any.js
TEST DONE 0 ForEach Check
TEST DONE 1 For-of Check
TEST DONE 0 empty
TEST DONE 1 delete next param during iteration
TEST DONE 1 delete current param during iteration
TEST DONE 1 delete every param seen during iteration
Running ../../tools/wpt/url/urlsearchparams-get.any.js
TEST DONE 0 Get basics
TEST DONE 0 More get() basics
Running ../../tools/wpt/url/urlsearchparams-getall.any.js
TEST DONE 0 getAll() basics
TEST DONE 0 getAll() multiples
Running ../../tools/wpt/url/urlsearchparams-has.any.js
TEST DONE 0 Has basics
TEST DONE 0 has() following delete()
TEST DONE 1 Two-argument has()
TEST DONE 1 Two-argument has() respects undefined as second arg
Running ../../tools/wpt/url/urlsearchparams-set.any.js
TEST DONE 0 Set basics
TEST DONE 0 URLSearchParams.set
Running ../../tools/wpt/url/urlsearchparams-size.any.js
TEST DONE 0 URLSearchParams's size and deletion
TEST DONE 0 URLSearchParams's size and addition
TEST DONE 0 URLSearchParams's size when obtained from a URL
TEST DONE 0 URLSearchParams's size when obtained from a URL and using .search
Running ../../tools/wpt/url/urlsearchparams-sort.any.js
TEST DONE 0 Parse and sort: z=b&a=b&z=a&a=a
TEST DONE 0 URL parse and sort: z=b&a=b&z=a&a=a
TEST DONE 0 Parse and sort: �=x&￼&�=a
TEST DONE 0 URL parse and sort: �=x&￼&�=a
TEST DONE 0 Parse and sort: ﬃ&🌈
TEST DONE 0 URL parse and sort: ﬃ&🌈
TEST DONE 1 Parse and sort: é&e�&é
TEST DONE 1 URL parse and sort: é&e�&é
TEST DONE 0 Parse and sort: z=z&a=a&z=y&a=b&z=x&a=c&z=w&a=d&z=v&a=e&z=u&a=f&z=t&a=g
TEST DONE 0 URL parse and sort: z=z&a=a&z=y&a=b&z=x&a=c&z=w&a=d&z=v&a=e&z=u&a=f&z=t&a=g
TEST DONE 0 Parse and sort: bbb&bb&aaa&aa=x&aa=y
TEST DONE 0 URL parse and sort: bbb&bb&aaa&aa=x&aa=y
TEST DONE 0 Parse and sort: z=z&=f&=t&=x
TEST DONE 0 URL parse and sort: z=z&=f&=t&=x
TEST DONE 0 Parse and sort: a🌈&a💩
TEST DONE 0 URL parse and sort: a🌈&a💩
TEST DONE 0 Sorting non-existent params removes ? from URL
Running ../../tools/wpt/url/urlsearchparams-stringifier.any.js
TEST DONE 1 Serialize space
TEST DONE 0 Serialize empty value
TEST DONE 0 Serialize empty name
TEST DONE 0 Serialize empty name and value
TEST DONE 0 Serialize +
TEST DONE 0 Serialize =
TEST DONE 0 Serialize &
TEST DONE 0 Serialize *-._
TEST DONE 1 Serialize %
TEST DONE 0 Serialize \0
TEST DONE 0 Serialize 💩
TEST DONE 1 URLSearchParams.toString
TEST DONE 1 URLSearchParams connected to URL
TEST DONE 0 URLSearchParams must not do newline normalization
Running ../../tools/wpt/encoding/api-basics.any.js
TEST DONE 0 Default encodings
TEST DONE 0 Default inputs
TEST DONE 0 Encode/decode round trip: utf-8
TEST DONE 1 Decode sample: utf-16le
TEST DONE 1 Decode sample: utf-16be
TEST DONE 1 Decode sample: utf-16
Running ../../tools/wpt/encoding/api-invalid-label.any.js
TEST DONE 1 Invalid label "invalid-invalidLabel" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0unicode-1-1-utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode-1-1-utf-8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0unicode-1-1-utf-8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vunicode-1-1-utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode-1-1-utf-8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vunicode-1-1-utf-8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode-1-1-utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode-1-1-utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode-1-1-utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode-1-1-utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode-1-1-utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode-1-1-utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode-1-1-utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode-1-1-utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode-1-1-utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0unicode11utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode11utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0unicode11utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vunicode11utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode11utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vunicode11utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode11utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode11utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode11utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode11utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode11utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode11utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode11utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode11utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode11utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode20utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0unicode20utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vunicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode20utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vunicode20utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf-8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0utf-8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vutf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf-8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vutf-8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf-8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf-8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vutf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vutf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0x-unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "x-unicode20utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\0x-unicode20utf8\0" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vx-unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "x-unicode20utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "\vx-unicode20utf8\v" should be rejected by TextDecoder.
TEST DONE 1 Invalid label " x-unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "x-unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " x-unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " x-unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "x-unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " x-unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " x-unicode20utf8" should be rejected by TextDecoder.
TEST DONE 1 Invalid label "x-unicode20utf8 " should be rejected by TextDecoder.
TEST DONE 1 Invalid label " x-unicode20utf8 " should be rejected by TextDecoder.
Running ../../tools/wpt/encoding/api-replacement-encodings.any.js
Running ../../tools/wpt/encoding/api-surrogates-utf8.any.js
TEST DONE 0 Invalid surrogates encoded into UTF-8: Sanity check
TEST DONE 1 Invalid surrogates encoded into UTF-8: Surrogate half (low)
TEST DONE 1 Invalid surrogates encoded into UTF-8: Surrogate half (high)
TEST DONE 1 Invalid surrogates encoded into UTF-8: Surrogate half (low), in a string
TEST DONE 1 Invalid surrogates encoded into UTF-8: Surrogate half (high), in a string
TEST DONE 1 Invalid surrogates encoded into UTF-8: Wrong order
Skipping ../../tools/wpt/encoding/encodeInto.any.js
Skipping ../../tools/wpt/encoding/idlharness.any.js
Skipping ../../tools/wpt/encoding/iso-2022-jp-decoder.any.js
Running ../../tools/wpt/encoding/replacement-encodings.any.js
Running ../../tools/wpt/encoding/textdecoder-arguments.any.js
TEST DONE 1 TextDecoder decode() with explicit undefined
TEST DONE 1 TextDecoder decode() with undefined and undefined
TEST DONE 1 TextDecoder decode() with undefined and options
Running ../../tools/wpt/encoding/textdecoder-byte-order-marks.any.js
TEST DONE 1 Byte-order marks: utf-8
TEST DONE 1 Byte-order marks: utf-16le
TEST DONE 1 Byte-order marks: utf-16be
Running ../../tools/wpt/encoding/textdecoder-copy.any.js
TEST DONE 1 Modify buffer after passing it in (ArrayBuffer)
TEST DONE 1 Modify buffer after passing it in (SharedArrayBuffer)
Running ../../tools/wpt/encoding/textdecoder-eof.any.js
TEST DONE 1 TextDecoder end-of-queue handling
TEST DONE 1 TextDecoder end-of-queue handling using stream: true
Skipping ../../tools/wpt/encoding/textdecoder-fatal-single-byte.any.js
Running ../../tools/wpt/encoding/textdecoder-fatal-streaming.any.js
TEST DONE 1 Fatal flag, non-streaming cases
TEST DONE 1 Fatal flag, streaming cases
Running ../../tools/wpt/encoding/textdecoder-fatal.any.js
TEST DONE 1 Fatal flag: utf-8 - invalid code
TEST DONE 1 Fatal flag: utf-8 - ends early
TEST DONE 1 Fatal flag: utf-8 - ends early 2
TEST DONE 1 Fatal flag: utf-8 - invalid trail
TEST DONE 1 Fatal flag: utf-8 - invalid trail 2
TEST DONE 1 Fatal flag: utf-8 - invalid trail 3
TEST DONE 1 Fatal flag: utf-8 - invalid trail 4
TEST DONE 1 Fatal flag: utf-8 - invalid trail 5
TEST DONE 1 Fatal flag: utf-8 - invalid trail 6
TEST DONE 1 Fatal flag: utf-8 - > 0x10FFFF
TEST DONE 1 Fatal flag: utf-8 - obsolete lead byte
TEST DONE 1 Fatal flag: utf-8 - overlong U+0000 - 2 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+0000 - 3 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+0000 - 4 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+0000 - 5 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+0000 - 6 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+007F - 2 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+007F - 3 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+007F - 4 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+007F - 5 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+007F - 6 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+07FF - 3 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+07FF - 4 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+07FF - 5 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+07FF - 6 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+FFFF - 4 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+FFFF - 5 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+FFFF - 6 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+10FFFF - 5 bytes
TEST DONE 1 Fatal flag: utf-8 - overlong U+10FFFF - 6 bytes
TEST DONE 1 Fatal flag: utf-8 - lead surrogate
TEST DONE 1 Fatal flag: utf-8 - trail surrogate
TEST DONE 1 Fatal flag: utf-8 - surrogate pair
TEST DONE 1 Fatal flag: utf-16le - truncated code unit
TEST DONE 1 The fatal attribute of TextDecoder
TEST DONE 1 Error seen with fatal does not prevent future decodes
Running ../../tools/wpt/encoding/textdecoder-ignorebom.any.js
TEST DONE 1 BOM is ignored if ignoreBOM option is specified: utf-8
TEST DONE 1 BOM is ignored if ignoreBOM option is specified: utf-16le
TEST DONE 1 BOM is ignored if ignoreBOM option is specified: utf-16be
TEST DONE 1 The ignoreBOM attribute of TextDecoder
Running ../../tools/wpt/encoding/textdecoder-labels.any.js
TEST DONE 0 unicode-1-1-utf-8 => UTF-8
TEST DONE 0 unicode11utf8 => UTF-8
TEST DONE 0 unicode20utf8 => UTF-8
TEST DONE 0 utf-8 => UTF-8
TEST DONE 0 utf8 => UTF-8
TEST DONE 0 x-unicode20utf8 => UTF-8
Running ../../tools/wpt/encoding/textdecoder-streaming.any.js
TEST DONE 1 Streaming decode: utf-8, 1 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 2 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 3 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 4 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 5 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 1 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 2 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 3 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 4 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 5 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 1 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 2 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 3 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 4 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 5 byte window (ArrayBuffer)
TEST DONE 1 Streaming decode: UTF-8 chunk tests (ArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 1 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 2 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 3 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 4 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-8, 5 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 1 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 2 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 3 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 4 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16le, 5 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 1 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 2 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 3 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 4 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: utf-16be, 5 byte window (SharedArrayBuffer)
TEST DONE 1 Streaming decode: UTF-8 chunk tests (SharedArrayBuffer)
Skipping ../../tools/wpt/encoding/textdecoder-utf16-surrogates.any.js
Running ../../tools/wpt/encoding/textencoder-constructor-non-utf.any.js
TEST DONE 0 Encoding argument supported for decode: UTF-8
TEST DONE 0 Encoding argument not considered for encode: UTF-8
Skipping ../../tools/wpt/encoding/textencoder-utf16-surrogates.any.js
Skipping ../../tools/wpt/encoding/unsupported-encodings.any.js
Running ../../tools/wpt/FileAPI/blob/Blob-array-buffer.any.js
TEST DONE 0 Blob.arrayBuffer()
TEST DONE 0 Blob.arrayBuffer() empty Blob data
TEST DONE 0 Blob.arrayBuffer() non-ascii input
TEST DONE 0 Blob.arrayBuffer() non-unicode input
TEST DONE 0 Blob.arrayBuffer() concurrent reads
Running ../../tools/wpt/FileAPI/blob/Blob-bytes.any.js
TEST DONE 0 Blob.bytes()
TEST DONE 0 Blob.bytes() empty Blob data
TEST DONE 0 Blob.bytes() non-ascii input
TEST DONE 0 Blob.bytes() non-unicode input
TEST DONE 0 Blob.bytes() concurrent reads
Running ../../tools/wpt/FileAPI/blob/Blob-constructor.any.js
TEST DONE 1 Blob interface object
TEST DONE 1 Blob constructor with no arguments
TEST DONE 0 Blob constructor with no arguments, without 'new'
TEST DONE 0 Blob constructor without brackets
TEST DONE 1 Blob constructor with undefined as first argument
TEST DONE 1 Passing non-objects, Dates and RegExps for blobParts should throw a TypeError.
TEST DONE 1 A plain object with custom @@iterator should be treated as a sequence for the blobParts argument.
TEST DONE 1 The length getter should be invoked and any exceptions should be propagated.
TEST DONE 1 ToUint32 should be applied to the length and any exceptions should be propagated.
TEST DONE 1 Getters and value conversions should happen in order until an exception is thrown.
TEST DONE 1 ToString should be called on elements of the blobParts array and any exceptions should be propagated.
TEST DONE 1 Passing a FrozenArray as the blobParts array should work (FrozenArray<MessagePort>).
TEST DONE 1 options properties should be accessed in lexicographic order.
TEST DONE 1 Arguments should be evaluated from left to right.
TEST DONE 1 Passing 123 for options should throw
TEST DONE 1 Passing 123.4 for options should throw
TEST DONE 1 Passing true for options should throw
TEST DONE 1 Passing "abc" for options should throw
TEST DONE 0 Blob with type ""
TEST DONE 0 Blob with type "a"
TEST DONE 1 Blob with type "A"
TEST DONE 0 Blob with type "text/html"
TEST DONE 1 Blob with type "TEXT/HTML"
TEST DONE 0 Blob with type "text/plain;charset=utf-8"
TEST DONE 1 Blob with type "å"
TEST DONE 1 Blob with type "𐑾"
TEST DONE 0 Blob with type " image/gif "
TEST DONE 1 Blob with type "\timage/gif\t"
TEST DONE 1 Blob with type "image/gif;"
TEST DONE 1 Blob with type "İmage/gif"
TEST DONE 1 Blob with type "ımage/gif"
TEST DONE 1 Blob with type "image/gif\0"
TEST DONE 0 Blob with type "unknown/unknown"
TEST DONE 0 Blob with type "text/plain"
TEST DONE 0 Blob with type "image/png"
TEST DONE 1 A plain object with @@iterator should be treated as a sequence for the blobParts argument.
TEST DONE 1 A plain object with @@iterator and a length property should be treated as a sequence for the blobParts argument.
TEST DONE 1 A String object should be treated as a sequence for the blobParts argument.
TEST DONE 1 A Uint8Array object should be treated as a sequence for the blobParts argument.
TEST DONE 1 Changes to the blobParts array should be reflected in the returned Blob (pop).
TEST DONE 1 Changes to the blobParts array should be reflected in the returned Blob (unshift).
TEST DONE 1 ToString should be called on elements of the blobParts array.
TEST DONE 1 ArrayBuffer elements of the blobParts array should be supported.
TEST DONE 1 Passing typed arrays as elements of the blobParts array should work.
TEST DONE 1 Passing a Float16Array as element of the blobParts array should work.
TEST DONE 1 Passing a Float64Array as element of the blobParts array should work.
TEST DONE 1 Passing BigInt typed arrays as elements of the blobParts array should work.
TEST DONE 0 Array with two blobs
TEST DONE 0 Array with two buffers
TEST DONE 1 Array with two bufferviews
TEST DONE 1 Array with mixed types
TEST DONE 0 Passing null (index 0) for options should use the defaults.
TEST DONE 0 Passing null (index 0) for options should use the defaults (with newlines).
TEST DONE 0 Passing undefined (index 1) for options should use the defaults.
TEST DONE 0 Passing undefined (index 1) for options should use the defaults (with newlines).
TEST DONE 0 Passing object "[object Object]" (index 2) for options should use the defaults.
TEST DONE 0 Passing object "[object Object]" (index 2) for options should use the defaults (with newlines).
TEST DONE 0 Passing object "[object Object]" (index 3) for options should use the defaults.
TEST DONE 0 Passing object "[object Object]" (index 3) for options should use the defaults (with newlines).
TEST DONE 0 Passing object "/regex/" (index 4) for options should use the defaults.
TEST DONE 0 Passing object "/regex/" (index 4) for options should use the defaults (with newlines).
TEST DONE 0 Passing function "function() {}" (index 5) for options should use the defaults.
TEST DONE 0 Passing function "function() {}" (index 5) for options should use the defaults (with newlines).
Running ../../tools/wpt/FileAPI/blob/Blob-slice-overflow.any.js
TEST DONE 0 slice start is negative, relativeStart will be max((size + start), 0)
TEST DONE 0 slice start is greater than blob size, relativeStart will be min(start, size)
TEST DONE 0 slice end is negative, relativeEnd will be max((size + end), 0)
TEST DONE 0 slice end is greater than blob size, relativeEnd will be min(end, size)
Running ../../tools/wpt/FileAPI/blob/Blob-slice.any.js
TEST DONE 0 Slicing test (0,0).
TEST DONE 0 Slicing test (0,1).
TEST DONE 0 Slicing test (0,2).
TEST DONE 0 Slicing test (0,3).
TEST DONE 0 Slicing test (0,4).
TEST DONE 0 Slicing test (0,5).
TEST DONE 0 Slicing test (0,6).
TEST DONE 0 Slicing test (0,7).
TEST DONE 0 Slicing test (0,8).
TEST DONE 0 Slicing test (1,0).
TEST DONE 0 Slicing test (1,1).
TEST DONE 0 Slicing test (1,2).
TEST DONE 0 Slicing test (1,3).
TEST DONE 0 Slicing test (1,4).
TEST DONE 0 Slicing test (1,5).
TEST DONE 0 Slicing test (1,6).
TEST DONE 0 Slicing test (1,7).
TEST DONE 0 Slicing test (2,0).
TEST DONE 0 Slicing test (2,1).
TEST DONE 0 Slicing test (2,2).
TEST DONE 0 Slicing test (2,3).
TEST DONE 0 Slicing test (3,0).
TEST DONE 0 Slicing test (3,1).
TEST DONE 0 Slicing test (3,2).
TEST DONE 0 Slicing test (3,3).
TEST DONE 0 Slicing test (3,4).
TEST DONE 0 Slicing test (3,5).
TEST DONE 0 Slicing test (4,0).
TEST DONE 0 Slicing test (4,1).
TEST DONE 0 Slicing test (4,2).
TEST DONE 0 Slicing test (4,3).
TEST DONE 0 Slicing test (4,4).
TEST DONE 0 Slicing test (5,0).
TEST DONE 0 Slicing test (5,1).
TEST DONE 0 Slicing test (5,2).
TEST DONE 0 Slicing test (5,3).
TEST DONE 0 Slicing test (6,0).
TEST DONE 0 Slicing test (6,1).
TEST DONE 0 Slicing test (6,2).
TEST DONE 0 Slicing test (7,0).
TEST DONE 0 Slicing test (7,1).
TEST DONE 0 Slicing test (7,2).
TEST DONE 0 Slicing test (7,3).
TEST DONE 0 Slicing test (8,0).
TEST DONE 0 Slicing test (8,1).
TEST DONE 0 Slicing test (8,2).
TEST DONE 0 Slicing test (8,3).
TEST DONE 0 Slices
TEST DONE 0 no-argument Blob slice
TEST DONE 0 blob1.
TEST DONE 0 blob2.
TEST DONE 0 null type Blob slice
TEST DONE 0 undefined type Blob slice
TEST DONE 0 no type Blob slice
TEST DONE 0 Slicing test: slice (0,0).
TEST DONE 0 Slicing test: slice (0,1).
TEST DONE 0 Slicing test: slice (0,2).
TEST DONE 0 Slicing test: slice (0,3).
TEST DONE 0 Slicing test: slice (0,4).
TEST DONE 0 Slicing test: slice (0,5).
TEST DONE 0 Slicing test: slice (0,6).
TEST DONE 0 Slicing test: slice (0,7).
TEST DONE 0 Slicing test: slice (0,8).
TEST DONE 0 Slicing test: slice (1,0).
TEST DONE 0 Slicing test: slice (1,1).
TEST DONE 0 Slicing test: slice (1,2).
TEST DONE 0 Slicing test: slice (1,3).
TEST DONE 0 Slicing test: slice (1,4).
TEST DONE 0 Slicing test: slice (1,5).
TEST DONE 0 Slicing test: slice (1,6).
TEST DONE 0 Slicing test: slice (1,7).
TEST DONE 0 Slicing test: slice (2,0).
TEST DONE 0 Slicing test: slice (2,1).
TEST DONE 0 Slicing test: slice (2,2).
TEST DONE 0 Slicing test: slice (2,3).
TEST DONE 0 Slicing test: slice (3,0).
TEST DONE 0 Slicing test: slice (3,1).
TEST DONE 0 Slicing test: slice (3,2).
TEST DONE 0 Slicing test: slice (3,3).
TEST DONE 0 Slicing test: slice (3,4).
TEST DONE 0 Slicing test: slice (3,5).
TEST DONE 0 Slicing test: slice (4,0).
TEST DONE 0 Slicing test: slice (4,1).
TEST DONE 0 Slicing test: slice (4,2).
TEST DONE 0 Slicing test: slice (4,3).
TEST DONE 0 Slicing test: slice (4,4).
TEST DONE 1 Slicing test: slice (5,0).
TEST DONE 1 Slicing test: slice (5,1).
TEST DONE 1 Slicing test: slice (5,2).
TEST DONE 1 Slicing test: slice (5,3).
TEST DONE 0 Slicing test: slice (6,0).
TEST DONE 0 Slicing test: slice (6,1).
TEST DONE 0 Slicing test: slice (6,2).
TEST DONE 1 Slicing test: slice (7,0).
TEST DONE 1 Slicing test: slice (7,1).
TEST DONE 1 Slicing test: slice (7,2).
TEST DONE 1 Slicing test: slice (7,3).
TEST DONE 1 Slicing test: slice (8,0).
TEST DONE 0 Slicing test: slice (8,1).
TEST DONE 0 Slicing test: slice (8,2).
TEST DONE 1 Slicing test: slice (8,3).
TEST DONE 1 Invalid contentType ("ÿ")
TEST DONE 1 Invalid contentType ("te\txt/plain")
TEST DONE 1 Invalid contentType ("te\0xt/plain")
TEST DONE 1 Invalid contentType ("te\x1fxt/plain")
TEST DONE 1 Invalid contentType ("text/plain")
TEST DONE 0 Valid contentType ("te(xt/plain")
TEST DONE 0 Valid contentType ("te)xt/plain")
TEST DONE 0 Valid contentType ("te<xt/plain")
TEST DONE 0 Valid contentType ("te>xt/plain")
TEST DONE 0 Valid contentType ("te@xt/plain")
TEST DONE 0 Valid contentType ("te,xt/plain")
TEST DONE 0 Valid contentType ("te;xt/plain")
TEST DONE 0 Valid contentType ("te:xt/plain")
TEST DONE 0 Valid contentType ("te\\xt/plain")
TEST DONE 0 Valid contentType ("te\"xt/plain")
TEST DONE 0 Valid contentType ("te/xt/plain")
TEST DONE 0 Valid contentType ("te[xt/plain")
TEST DONE 0 Valid contentType ("te]xt/plain")
TEST DONE 0 Valid contentType ("te?xt/plain")
TEST DONE 0 Valid contentType ("te=xt/plain")
TEST DONE 0 Valid contentType ("te{xt/plain")
TEST DONE 0 Valid contentType ("te}xt/plain")
TEST DONE 0 Valid contentType ("te xt/plain")
TEST DONE 1 Valid contentType ("TEXT/PLAIN")
TEST DONE 1 Valid contentType ("text/plain;charset = UTF-8")
TEST DONE 1 Valid contentType ("text/plain;charset=UTF-8")
Running ../../tools/wpt/FileAPI/blob/Blob-stream.any.js
TEST DONE 0 Blob.stream()
TEST DONE 0 Blob.stream() empty Blob
TEST DONE 0 Blob.stream() non-unicode input
TEST DONE 1 Blob.stream() garbage collection of blob shouldn't break stream consumption
TEST DONE 1 Blob.stream() garbage collection of stream shouldn't break stream consumption
TEST DONE 1 Reading Blob.stream() with BYOB reader
Running ../../tools/wpt/FileAPI/blob/Blob-text.any.js
TEST DONE 0 Blob.text()
TEST DONE 0 Blob.text() empty blob data
TEST DONE 0 Blob.text() multi-element array in constructor
TEST DONE 0 Blob.text() non-unicode
TEST DONE 0 Blob.text() different charset param in type option
TEST DONE 0 Blob.text() different charset param with non-ascii input
TEST DONE 1 Blob.text() invalid utf-8 input
TEST DONE 1 Blob.text() concurrent reads
Running ../../tools/wpt/FileAPI/file/File-constructor.any.js
TEST DONE 0 File interface object exists
TEST DONE 1 Required arguments
TEST DONE 0 empty fileBits
TEST DONE 0 DOMString fileBits
TEST DONE 0 Unicode DOMString fileBits
TEST DONE 1 String object fileBits
TEST DONE 0 Empty Blob fileBits
TEST DONE 0 Blob fileBits
TEST DONE 0 Empty File fileBits
TEST DONE 0 File fileBits
TEST DONE 0 ArrayBuffer fileBits
TEST DONE 0 Typed array fileBits
TEST DONE 1 Various fileBits
TEST DONE 1 Number in fileBits
TEST DONE 1 Array in fileBits
TEST DONE 1 Object in fileBits
TEST DONE 1 Object with toString in fileBits
TEST DONE 1 Custom @@iterator
TEST DONE 0 Invalid bits argument: "hello"
TEST DONE 1 Invalid bits argument: 0
TEST DONE 1 Invalid bits argument: null
TEST DONE 1 Bits argument: object that throws
TEST DONE 0 Using fileName
TEST DONE 0 No replacement when using special character in fileName
TEST DONE 1 Using null fileName
TEST DONE 1 Using number fileName
TEST DONE 0 Using empty string fileName
TEST DONE 0 Using type in File constructor: text/plain
TEST DONE 1 Using type in File constructor: text/plain;charset=UTF-8
TEST DONE 1 Using type in File constructor: TEXT/PLAIN
TEST DONE 1 Using type in File constructor: 𝓽𝓮𝔁𝓽/𝔭𝔩𝔞𝔦𝔫
TEST DONE 1 Using type in File constructor: ascii/nonprintable
TEST DONE 1 Using type in File constructor: ascii/nonprintable
TEST DONE 1 Using type in File constructor: nonasciiî
TEST DONE 1 Using type in File constructor: nonasciiሴ
TEST DONE 0 Using type in File constructor: nonparsable
TEST DONE 0 Using lastModified
TEST DONE 0 Misusing name
TEST DONE 0 Unknown properties are ignored
TEST DONE 1 Invalid property bag: 123
TEST DONE 1 Invalid property bag: 123.4
TEST DONE 1 Invalid property bag: true
TEST DONE 1 Invalid property bag: "abc"
TEST DONE 0 Unusual but valid property bag: null
TEST DONE 0 Unusual but valid property bag: undefined
TEST DONE 0 Unusual but valid property bag: 1,2,3
TEST DONE 0 Unusual but valid property bag: /regex/
TEST DONE 0 Unusual but valid property bag: function() {}
TEST DONE 1 Property bag propagates exceptions
Running ../../tools/wpt/FileAPI/file/send-file-formdata-controls.any.js
TEST DONE 1 Upload file-for-upload-in-form-NUL-[ ].txt (ASCII) in fetch with FormData
Running ../../tools/wpt/FileAPI/file/send-file-formdata-punctuation.any.js
TEST DONE 1 Upload file-for-upload-in-form-QUOTATION-MARK-["].txt (ASCII) in fetch with FormData
Running ../../tools/wpt/FileAPI/file/send-file-formdata-utf-8.any.js
TEST DONE 1 Upload file-for-upload-in-form.txt (ASCII) in fetch with FormData
Running ../../tools/wpt/FileAPI/file/send-file-formdata.any.js
TEST DONE 1 Upload file-for-upload-in-form.txt (ASCII) in fetch with FormData
Running ../../tools/wpt/FileAPI/reading-data-section/Determining-Encoding.any.js
TEST DONE 1 Blob Determing Encoding with encoding argument
TEST DONE 1 Blob Determing Encoding with type attribute
TEST DONE 1 Blob Determing Encoding with UTF-8 BOM
TEST DONE 0 Blob Determing Encoding without anything implying charset.
TEST DONE 1 Blob Determing Encoding with UTF-16BE BOM
TEST DONE 1 Blob Determing Encoding with UTF-16LE BOM
Running ../../tools/wpt/FileAPI/reading-data-section/FileReader-event-handler-attributes.any.js
TEST DONE 0 FileReader.onloadstart: initial value
TEST DONE 0 FileReader.onprogress: initial value
TEST DONE 0 FileReader.onload: initial value
TEST DONE 0 FileReader.onabort: initial value
TEST DONE 0 FileReader.onerror: initial value
TEST DONE 0 FileReader.onloadend: initial value
Running ../../tools/wpt/FileAPI/reading-data-section/FileReader-multiple-reads.any.js
TEST DONE 1 test FileReader InvalidStateError exception for readAsText
TEST DONE 1 test FileReader InvalidStateError exception for readAsDataURL
TEST DONE 1 test FileReader InvalidStateError exception for readAsArrayBuffer
TEST DONE 1 test FileReader InvalidStateError exception in onloadstart event for readAsArrayBuffer
TEST DONE 0 test FileReader no InvalidStateError exception in loadend event handler for readAsArrayBuffer
TEST DONE 0 test abort and restart in onloadstart event for readAsText
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_abort.any.js
TEST DONE 1 Aborting before read
TEST DONE 1 Aborting after read
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_error.any.js
TEST DONE 1 Untitled
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_events.any.js
TEST DONE 1 events are dispatched in the correct order for an empty blob
TEST DONE 1 events are dispatched in the correct order for a non-empty blob
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_readAsArrayBuffer.any.js
TEST DONE 1 Untitled
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_readAsBinaryString.any.js
TEST DONE 1 Untitled
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_readAsDataURL.any.js
TEST DONE 1 FileReader readyState during readAsDataURL
TEST DONE 1 readAsDataURL result for Blob with specified MIME type
TEST DONE 1 readAsDataURL result for Blob with unspecified MIME type
TEST DONE 1 readAsDataURL result for empty Blob
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_readAsText.any.js
TEST DONE 1 readAsText should correctly read UTF-8.
TEST DONE 1 readAsText should correctly read UTF-16.
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_readystate.any.js
TEST DONE 1 Untitled
Running ../../tools/wpt/FileAPI/reading-data-section/filereader_result.any.js
TEST DONE 0 readAsText
TEST DONE 0 readAsDataURL
TEST DONE 0 readAsArrayBuffer
TEST DONE 0 readAsBinaryString
TEST DONE 1 result is null during "loadstart" event for readAsText
TEST DONE 1 result is null during "loadstart" event for readAsDataURL
TEST DONE 1 result is null during "loadstart" event for readAsArrayBuffer
TEST DONE 1 result is null during "loadstart" event for readAsBinaryString
TEST DONE 1 result is null during "progress" event for readAsText
TEST DONE 1 result is null during "progress" event for readAsDataURL
TEST DONE 1 result is null during "progress" event for readAsArrayBuffer
TEST DONE 1 result is null during "progress" event for readAsBinaryString
Running ../../tools/wpt/dom/events/AddEventListenerOptions-once.any.js
TEST DONE 0 Once listener should be invoked only once
TEST DONE 0 Once listener should be invoked only once even if the event is nested
TEST DONE 0 Once listener should be added / removed like normal listeners
TEST DONE 0 Multiple once listeners should be invoked even if the stopImmediatePropagation is set
Running ../../tools/wpt/dom/events/AddEventListenerOptions-passive.any.js
TEST DONE 1 Supports passive option on addEventListener only
TEST DONE 0 preventDefault should be ignored if-and-only-if the passive option is true
TEST DONE 1 returnValue should be ignored if-and-only-if the passive option is true
TEST DONE 0 passive behavior of one listener should be unaffected by the presence of other listeners
TEST DONE 1 Equivalence of option values
Running ../../tools/wpt/dom/events/AddEventListenerOptions-signal.any.js
TEST DONE 0 Passing an AbortSignal to addEventListener options should allow removing a listener
TEST DONE 0 Passing an AbortSignal to addEventListener does not prevent removeEventListener
TEST DONE 0 Passing an AbortSignal to addEventListener works with the once flag
TEST DONE 0 Removing a once listener works with a passed signal
TEST DONE 0 Passing an AbortSignal to multiple listeners
TEST DONE 0 Passing an AbortSignal to addEventListener works with the capture flag
TEST DONE 0 Aborting from a listener does not call future listeners
TEST DONE 0 Adding then aborting a listener in another listener does not call it
TEST DONE 0 Aborting from a nested listener should remove it
TEST DONE 0 Passing null as the signal should throw
TEST DONE 0 Passing null as the signal should throw (listener is also null)
Running ../../tools/wpt/dom/events/Event-constructors.any.js
TEST DONE 0 Untitled
TEST DONE 0 Untitled 1
TEST DONE 1 Untitled 2
TEST DONE 0 Untitled 3
TEST DONE 0 Untitled 4
TEST DONE 0 Untitled 5
TEST DONE 0 Untitled 6
TEST DONE 0 Untitled 7
TEST DONE 0 Untitled 8
TEST DONE 0 Untitled 9
TEST DONE 0 Untitled 10
TEST DONE 0 Untitled 11
TEST DONE 0 Untitled 12
TEST DONE 0 Untitled 13
Running ../../tools/wpt/dom/events/Event-isTrusted.any.js
TEST DONE 1 Untitled
Running ../../tools/wpt/dom/events/EventTarget-add-remove-listener.any.js
TEST DONE 0 Removing an event listener without explicit capture arg should succeed
Running ../../tools/wpt/dom/events/EventTarget-addEventListener.any.js
TEST DONE 0 Adding a null event listener should succeed
Running ../../tools/wpt/dom/events/EventTarget-constructible.any.js
TEST DONE 0 A constructed EventTarget can be used as expected
TEST DONE 1 A constructed EventTarget implements dispatch correctly
TEST DONE 0 EventTarget can be subclassed
Skipping ../../tools/wpt/dom/events/EventTarget-removeEventListener.any.js
Running ../../tools/wpt/urlpattern/urlpattern-compare.tentative.any.js
Running ../../tools/wpt/urlpattern/urlpattern-compare.tentative.https.any.js
Running ../../tools/wpt/urlpattern/urlpattern-generate.tentative.any.js
TEST DONE 1 Loading data...
Running ../../tools/wpt/urlpattern/urlpattern-hasregexpgroups.any.js
Running ../../tools/wpt/urlpattern/urlpattern.any.js
Running ../../tools/wpt/urlpattern/urlpattern.https.any.js

1351 tests, 686 passed, 660 failed (5 not completed)
 -> 50% conformance
