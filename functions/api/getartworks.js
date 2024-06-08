export async function onRequest(context) {
    try {
        console.log('Function triggered: getartworksbyartist');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract artistId from the request
        const { artistId } = await context.request.json();

        // Check if artistId is provided
        if (!artistId) {
            throw new Error("artistId is required");
        }

        // Prepare the SQL statement to fetch artworks by artistId
        const statement = `
            SELECT * FROM artwork
            WHERE artistId = ?;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(artistId)
            .all();

        // Check if the query was successful and results are available
        if (!res || !res.results) {
            throw new Error("No artworks found for the given artistId");
        }

        const artworks = res.results;

        // Return a JSON response with the artworks
        return new Response(JSON.stringify(artworks), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
