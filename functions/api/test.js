export async function onRequest(event) {
    console.log('Function triggered!');
    const res = await event.env.DB.prepare("select * from artist;").all()
    const artists = res.results
    return new Response(artists);
}
