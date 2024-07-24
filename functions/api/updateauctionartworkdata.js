export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400',
};

export const buildResponse = (status, data) => {
    const headers = new Headers({
        ...corsHeaders,
        'Content-Type': 'application/json',
    });
    return new Response(JSON.stringify(data), { headers, status });
};

export const onRequestOptions = async () => {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
};

const allowCors = (fn) => async (context) => {
    const { request } = context;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return onRequestOptions();
    }

    try {
        return await fn(context);
    } catch (error) {
        console.error("An error occurred: ", error);
        return buildResponse(500, { message: "Internal Server Error" });
    }
};

export async function onRequestPost(context) {
    try {
        console.log("Function triggered: updateauctionartworkdata");

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Parse the request body
        const requestBody = await context.request.json();
        const { auctionId, addedArtworks, removedArtworks } = requestBody;

        if (!auctionId || !Array.isArray(addedArtworks) || !Array.isArray(removedArtworks)) {
            throw new Error("Invalid request body");
        }

        // Prepare batch statements
        const batchStatements = [];

        // Remove artworks from the lot table
        if (removedArtworks.length > 0) {
            const removeStatement = `DELETE FROM lot WHERE auctionId = ? AND artworkId IN (${removedArtworks.map(() => '?').join(', ')})`;
            batchStatements.push(context.env.DB.prepare(removeStatement).bind(auctionId, ...removedArtworks));
        }

        // Fetch the current max lot number for the auction to determine the next lot number
        const { results: currentMax } = await context.env.DB.prepare(
            `SELECT MAX(lotNumber) as maxLotNumber FROM lot WHERE auctionId = ?`
        ).bind(auctionId).first();
        console.log(currentMax)

        let nextLotNumber = (currentMax?.maxLotNumber || 0) + 1;

        // Add new artworks to the lot table
        if (addedArtworks.length > 0) {
            for (const artworkId of addedArtworks) {
                const addStatement = `INSERT INTO lot (auctionId, lotNumber, artworkId) VALUES (?, ?, ?)`;
                batchStatements.push(context.env.DB.prepare(addStatement).bind(auctionId, nextLotNumber++, artworkId));
            }
        }

        // Execute batch transaction
        await context.env.DB.batch(batchStatements);

        // Return a success response
        return buildResponse(200, { message: "Artworks updated successfully" });

    } catch (error) {
        console.error(error);

        return buildResponse(500, { message: "Internal Server Error" });
    }
}

export default allowCors(onRequestPost);
