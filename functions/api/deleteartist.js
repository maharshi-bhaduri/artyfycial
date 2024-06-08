export async function onRequest(context) {
    try {
        console.log('Function triggered: deleteartist');

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

        // Begin a transaction
        await context.env.DB.exec("BEGIN TRANSACTION");

        try {
            // Delete related artworks
            let statement = `
                DELETE FROM artwork
                WHERE artistId = ?;
            `;
            await context.env.DB.prepare(statement)
                .bind(artistId)
                .run();

            // Delete the artist
            statement = `
                DELETE FROM artist
                WHERE artistId = ?;
            `;
            const res = await context.env.DB.prepare(statement)
                .bind(artistId)
                .run();

            // Check if the deletion was successful
            if (!res.success) {
                throw new Error("Failed to delete artist");
            }

            // Commit the transaction
            await context.env.DB.exec("COMMIT");

            // Return a success response
            return new Response(JSON.stringify({ message: 'Artist and related artworks deleted successfully' }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            // Rollback the transaction in case of an error
            await context.env.DB.exec("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
