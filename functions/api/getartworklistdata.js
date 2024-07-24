export async function onRequest(context) {
  try {
    console.log("Function triggered: getartworksbyartist");

    // Check if the DB binding exists
    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }

    // Extract parameters from the request
    const url = new URL(context.request.url);
    const artistId = url.searchParams.get("artistId");
    const current = url.searchParams.get("current");
    const searchQuery = url.searchParams.get("searchQuery") ? decodeURIComponent(url.searchParams.get("searchQuery")) : '';
    const searchOthers = url.searchParams.get("searchOthers") === 'true';
    const limit = url.searchParams.get("limit") || 20;

    // Prepare the SQL statement to fetch artworks
    let statement = `SELECT * FROM artwork WHERE 1=1`;
    let bindings = [];

    if (!searchOthers) {
      if (!artistId) {
        throw new Error("artistId is required if searchOthers is false");
      }
      statement += ` AND artistId = ?`;
      bindings.push(artistId);
    } else {
      if (artistId) {
        statement += ` AND artistId != ?`;
        bindings.push(artistId);
      }
    }

    if (current) {
      statement += ` AND artworkId != ?`;
      bindings.push(current);
    }

    if (searchQuery) {
      statement += ` AND title LIKE ?`;
      bindings.push(`%${searchQuery}%`);
    }

    statement += ` LIMIT ?`;
    bindings.push(limit);

    statement += `;`;

    // Execute the SQL statement
    const res = await context.env.DB.prepare(statement).bind(...bindings).all();

    // Check if the query was successful and results are available
    if (!res || !res.results) {
      throw new Error("No artworks found for the given query");
    }

    const artworks = res.results;

    // Return a JSON response with the artworks
    return new Response(JSON.stringify(artworks), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
