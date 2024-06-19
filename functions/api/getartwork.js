export async function onRequest(context) {
  try {
    console.log("Function triggered: getartwork");

    // Check if the DB binding exists
    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }

    // Extract artworkId from the request
    const url = new URL(context.request.url);
    const artworkId = url.searchParams.get("artworkId");

    // Check if artworkId is provided
    if (!artworkId) {
      throw new Error("artworkId is required");
    }

    // Prepare the SQL statement to fetch artwork details by artworkId
    const statement = `
            SELECT * FROM artwork
            WHERE artworkId = ?;
        `;

    // Execute the SQL statement
    const res = await context.env.DB.prepare(statement).bind(artworkId).first();

    // Check if the query was successful and results are available
    if (!res) {
      throw new Error("Artwork not found");
    }

    const artwork = res;

    // Return a JSON response with the artwork details
    return new Response(JSON.stringify(artwork), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
