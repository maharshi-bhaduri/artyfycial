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
        console.log("hello from cors. incoming function: ", fn)

        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return onRequestOptions();
        }
    }
    catch (error) {
        console.error("An error occurred: ", error);
        return buildResponse(500, { message: "CORS error" })
    }
    try {
        await fn(context);
    }
    catch (error) {
        console.error("An error occurred: ", error);
        return;
    }
}

export async function onRequest(context) {
    try {
        console.log('Function triggered: getAuctionListData');

        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Verify the ID token if necessary
        // const { isValid, decoded, error } = await verifyIdToken(context);
        // if (!isValid) {
        //     return buildResponse(401, { message: "Unauthorized" });
        // }

        // Fetch auction list from the database
        const result = await context.env.DB.prepare(`
            SELECT auctionId, auctionName, auctionDescription, startTime, endTime, auctioneerId, anonAuction
            FROM auction
            WHERE isActive = 1
        `).all();

        if (!result.success) {
            throw new Error("Failed to fetch auction list");
        }

        const auctionList = result.results;

        return buildResponse(200, auctionList);
    } catch (error) {
        console.error(error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
};

export default allowCors(onRequest);
