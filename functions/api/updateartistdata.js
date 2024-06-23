export async function onRequest(context) {
    try {
        console.log('Function triggered: updateartist');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract data from the request
        const { artistId, firstName, lastName, about, socials, phoneNumber, location, joinDate, active } = await context.request.json();

        // Check if artistId is provided
        if (!artistId) {
            throw new Error("artistId is required");
        }

        // Prepare the SQL statement for updating an artist
        const statement = `
            UPDATE artist
            SET firstName = ?, lastName = ?, about = ?, socials = ?, phoneNumber = ?, location = ?, joinDate = ?, active = ?
            WHERE artistId = ?;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(firstName, lastName, about, socials, phoneNumber, location, joinDate, active, artistId)
            .run();

        // Check if the update was successful
        if (!res.success) {
            throw new Error("Failed to update artist");
        }

        // Return a success response
        return new Response(JSON.stringify({ message: 'Artist updated successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
