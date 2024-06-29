export async function onRequest(context) {
    try {
        console.log('Function triggered: updateartwork');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract artwork details from the request
        const { artworkId, title, description, isActive, isPublic } = await context.request.json();

        // Check if artworkId is provided
        if (!artworkId) {
            throw new Error("artworkId is required");
        }

        // Prepare the SQL statement for updating an artwork
        const statement = `
            UPDATE artwork
            SET title = ?, description = ?, isActive = ?, isPublic = ?
            WHERE artworkId = ?;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(title, description, isActive, isPublic, artworkId)
            .run();

        // Check if the update was successful
        if (!res.success) {
            throw new Error("Failed to update artwork");
        }

        // Return a success response
        return new Response(JSON.stringify({ message: 'Artwork updated successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
