export async function onRequest(context) {
    try {
        console.log('Function triggered!');

        console.log(context.env.DB)

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        const res = await context.env.DB.prepare("SELECT * FROM artist limit 10;").all();

        // Check if the query was successful and results are available
        if (!res || !res.results) {
            throw new Error("No results found");
        }

        const artists = res.results;

        // Return a JSON response
        return new Response(JSON.stringify(artists), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
