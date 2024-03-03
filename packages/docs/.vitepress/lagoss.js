export function handler(request) {
  return new Response('Hello, <b>World!</b>', {
    headers: { 'content-type': 'text/html' },
  });
}
