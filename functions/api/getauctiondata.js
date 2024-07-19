// import necessary modules
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
    try {
        const { request } = context;

        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return onRequestOptions();
        }
    } catch (error) {
        console.error("An error occurred: ", error);
        return buildResponse(500, { message: "CORS error" });
    }
    try {
        await fn(context);
    } catch (error) {
        console.error("An error occurred: ", error);
        return;
    }
};

export async function onRequest(context) {
    try {
        console.log('Function triggered: getauctiondata');

        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract auctionId from query string
        const url = new URL(context.request.url);
        const auctionId = url.searchParams.get('auctionId');

        if (!auctionId) {
            return buildResponse(400, { message: "auctionId is required" });
        }

        // Fetch auction details from the database
        const result = await context.env.DB.prepare(`
            SELECT auctionId, auctionName, auctionDescription, startTime, endTime, auctioneerId, anonAuction
            FROM auction
            WHERE auctionId = ? AND isActive = 1
        `).bind(auctionId).first();

        if (!result) {
            throw new Error("Failed to fetch auction details");
        }

        if (!result) {
            return buildResponse(404, { message: "Auction not found" });
        }

        return buildResponse(200, result);
    } catch (error) {
        console.error(error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
};

export default allowCors(onRequest);
