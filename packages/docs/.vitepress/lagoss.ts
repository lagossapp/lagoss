export function handler(request: Request) {
  return new Response('', {
    status: 302,
    headers: {
      location: '/404.html',
    },
  });
}
