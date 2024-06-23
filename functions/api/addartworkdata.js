export async function onRequest(context) {
    try {
        console.log('Function triggered: addartwork');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract artwork details from the request with default values
        const { artistId, title, uploadDate, description, isActive, path, isPublic = true, clickCount = 0 } = await context.request.json();

        // Check if required fields are provided
        if (!artistId || !title) {
            throw new Error("artistId and title are required");
        }

        // Prepare the SQL statement for inserting a new artwork
        const statement = `
            INSERT INTO artwork (artistId, title, uploadDate, description, isActive, path, isPublic, clickCount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(artistId, title, uploadDate, description, isActive, path, isPublic, clickCount)
            .run();

        // Check if the insertion was successful
        if (!res.success) {
            throw new Error("Failed to add artwork");
        }

        // Return a success response
        return new Response(JSON.stringify({ message: 'Artwork added successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
