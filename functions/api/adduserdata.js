// import { allowCors, buildResponse } from "../utils/utils";


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

async function md5Hash(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('MD5', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string

    return hashHex;
}


export async function onRequestPost(context) {
    try {
        console.log('Function triggered: addUserData');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract data from the request
        const { uid, firstName, lastName } = await context.request.json();

        if (!uid || !firstName || !lastName) {
            throw new Error("uid, firstName, and lastName are required");
        }

        // Generate userName using MD5 hash of uid, current timestamp, and a random number
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        const userName = await md5Hash(uid + timestamp + random);

        // Get the current date for joinDate and lastLoginDate
        const currentDate = new Date().toISOString().split('T')[0];

        // Default values for isPublic, artistFlag, and isActive
        const isPublic = true;
        const artistFlag = false;
        const isActive = true;

        // Check if the user already exists
        const existingUser = await context.env.DB.prepare("SELECT * FROM user WHERE uid = ?").bind(uid).all();
        if (existingUser.results.length > 0) {
            // User already exists, update lastLoginDate
            await context.env.DB.prepare("UPDATE user SET lastLoginDate = ? WHERE uid = ?").bind(currentDate, uid).run();
            return buildResponse(200, { userId: existingUser.results[0].userId })
        }

        // User does not exist, insert new user
        const statement = `
            INSERT INTO user (userName, uid, firstName, lastName, lastLoginDate, joinDate, isPublic, artistFlag, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const result = await context.env.DB.prepare(statement)
            .bind(userName, uid, firstName, lastName, currentDate, currentDate, isPublic, artistFlag, isActive)
            .run();
        // Check if the insertion was successful
        if (!result.success) {
            throw new Error("Failed to register user");
        }
        // Return a success response
        return buildResponse(200, { userId: result.meta.last_row_id })
        // res.status(200).json({ userId: result.lastInsertRowid });
    } catch (error) {
        console.error(error);
        return buildResponse(500, { message: 'Internal Server Error' })
    }
};

export default allowCors(onRequestPost);