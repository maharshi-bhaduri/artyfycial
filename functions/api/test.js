export async function onRequest(event) {
    console.log('Function triggered!');
    return new Response('Second functions says hello too!');
}
