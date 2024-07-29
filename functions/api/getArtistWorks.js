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

        if (!artistId) {
            return new Response("artistId is required", { status: 400 });
        }

        // Prepare the SQL statement to fetch artworks by artistId
        const statement = `SELECT * FROM artwork WHERE artistId = ?;`;
        const bindings = [artistId];

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement).bind(...bindings).all();

        // Check if the query was successful and results are available
        if (!res || !res.results) {
            throw new Error("No artworks found for the given artistId");
        }

        const artworks = res.results;
        const vercelApiUrl = new URL(context.env.VERCEL_API_URL);

        // Prepare the body for the POST request
        const requestBody = JSON.stringify({
            artistId,
            artworks
        });

        // Make a POST request to the Vercel API
        const response = await fetch(vercelApiUrl.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data from Vercel API");
        }

        const vercelData = await response.json();

        // Return a JSON response with the artworks
        return new Response(JSON.stringify(vercelData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
