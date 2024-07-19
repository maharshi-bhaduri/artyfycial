// import { corsHeaders, buildResponse, allowCors } from "../utils/utils";
import { parseISO, differenceInDays } from "date-fns";
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

export async function onRequestPost(context) {
    try {
        console.log('Function triggered: createAuctionData');

        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        const { isValid, decoded, error } = await verifyIdToken(context);

        const { auctionName, auctionDescription, startTime, endTime, anonAuction } = await context.request.json();

        if (!auctionName || !startTime || !endTime || anonAuction === undefined) {
            throw new Error("Required fields: auctionName, startTime, endTime, anonAuction");
        }

        const currentDate = new Date();
        const parsedStartTime = parseISO(startTime);
        const parsedEndTime = parseISO(endTime);

        if (differenceInDays(parsedStartTime, currentDate) < 5) {
            throw new Error("Start time must be at least 5 days from the current date");
        }

        if (parsedEndTime <= parsedStartTime) {
            throw new Error("End time must be greater than start time");
        }

        const userIdResults = await context.env.DB.prepare("SELECT * FROM user WHERE uid = ?").bind(decoded).all();

        const auctioneerId = userIdResults.results[0].userId;
        console.log('auctioneerId ', auctioneerId)


        const statement = `
            INSERT INTO auction (auctionName, auctionDescription, startTime, endTime, auctioneerId, anonAuction)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const result = await context.env.DB.prepare(statement)
            .bind(auctionName, auctionDescription, startTime, endTime, auctioneerId, anonAuction)
            .run();

        if (!result.success) {
            throw new Error("Failed to create auction");
        }

        const auctionData = {
            auctionId: result.meta.last_row_id,
            auctionName,
            auctionDescription,
            startTime,
            endTime,
            auctioneerId,
            anonAuction,
            artworks: []
        };

        return buildResponse(200, auctionData);
    } catch (error) {
        console.error(error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
};

export default allowCors(onRequestPost);
