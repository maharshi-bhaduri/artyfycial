export async function onRequest(context) {
    try {
        console.log('Function triggered: getartists');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Prepare the SQL statement to fetch all artists
        const statement = `
            SELECT * FROM artist;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement).all();

        // Check if the query was successful and results are available
        if (!res || !res.results) {
            throw new Error("No artists found");
        }

        const artists = res.results;

        // Return a JSON response with the artists
        return new Response(JSON.stringify(artists), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
