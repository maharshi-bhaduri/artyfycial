// import { allowCors, buildResponse } from "../utils/utils";
import { verifyIdToken } from "../utils/verifytoken"

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
        console.log('Function triggered: getUserData');

        const { isValid, decoded, error } = await verifyIdToken(context);
        console.log("decoded ", decoded)

        if (!isValid || error) {
            return buildResponse(403, { message: "Unable to authenticate user." })
        }

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Check if the user already exists
        const userResults = await context.env.DB.prepare("SELECT * FROM user WHERE uid = ?").bind(decoded).all();
        const userDetails = userResults.results[0]

        return buildResponse(200, userDetails)
    } catch (error) {
        console.error(error);
        return buildResponse(500, { message: 'Internal Server Error' })
    }
};

export default allowCors(onRequest);