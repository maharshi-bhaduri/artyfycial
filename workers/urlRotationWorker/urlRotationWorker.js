export default {
    async fetch(request, env, ctx) {
        return new Response('This worker does not handle fetch events directly.');
    },

    // This event listener will trigger your scheduled task
    async scheduled(event, env, ctx) {
        await ctx.waitUntil(handleScheduled(env));
    }
};

async function handleScheduled(env) {
    // Check if the DB binding exists
    if (!env.DB) {
        throw new Error("DB binding not found");
    }

    try {
        // Your logic to populate/update the table
        const imageId = 'some-id'; // Example ID
        const url = 'https://example.com/image.jpeg'; // Example URL
        const expireTime = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

        // Prepare the SQL statement to insert or update the image URL
        await env.DB.prepare(`
        INSERT INTO image_url_store (artworkId, url, expireTime)
        VALUES (?, ?, ?)
        ON CONFLICT(artworkId) DO UPDATE SET url = excluded.url, expireTime = excluded.expireTime
      `).bind(imageId, url, expireTime).run();

        console.log('Successfully updated image URL');
    } catch (error) {
        console.error('Error updating image URL:', error);
    }
}
