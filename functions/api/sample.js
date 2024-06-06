export async function onRequest(event) {
    console.log('Function triggered!');
    return new Response('Hello from Cloudflare Pages Function!');
}
