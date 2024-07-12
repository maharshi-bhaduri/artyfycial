export async function onRequest(context) {
    try {
        console.log('Function triggered: getFeed');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract page number from the request, default to 1 if not provided
        const url = new URL(context.request.url);
        const page = parseInt(url.searchParams.get("page")) || 1;
        const batchSize = 20;
        const offset = (page - 1) * batchSize;

        // Prepare the SQL statement to fetch artworks ordered by upload date with pagination
        const statement = `
            SELECT * FROM artwork a
            join user u on a.artistId = u.userId
            ORDER BY uploadDate DESC
            LIMIT ? OFFSET ?;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(batchSize, offset)
            .all();

        // Check if the query was successful and results are available
        if (!res || !res.results) {
            throw new Error("No artworks found");
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
