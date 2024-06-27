export async function onRequestPost(context) {
    try {
        console.log('Function triggered: deleteartwork');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract artworkId from the request
        const { artworkId } = await context.request.json();

        // Check if artworkId is provided
        if (!artworkId) {
            throw new Error("artworkId is required");
        }

        // Prepare the SQL statement for deleting an artwork
        const statement = `
            DELETE FROM artwork
            WHERE artworkId = ?;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(artworkId)
            .run();

        // Check if the deletion was successful
        if (!res.success) {
            throw new Error("Failed to delete artwork");
        }

        // Return a success response
        return new Response(JSON.stringify({ message: 'Artwork deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}