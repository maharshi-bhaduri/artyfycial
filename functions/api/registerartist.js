export async function onRequest(context) {
    try {
        console.log('Function triggered: registerartist');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract data from the request
        const { firstName, lastName, about, socials, phoneNumber, location, joinDate, active } = await context.request.json();

        // Prepare the SQL statement for inserting a new artist
        const statement = `
            INSERT INTO artist (firstName, lastName, about, socials, phoneNumber, location, joinDate, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(firstName, lastName, about, socials, phoneNumber, location, joinDate, active)
            .run();

        // Check if the insertion was successful
        if (!res.success) {
            throw new Error("Failed to register artist");
        }

        // Return a success response
        return new Response(JSON.stringify({ message: 'Artist registered successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
