
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


export async function onRequestPost(context) {
    try {
        console.log('Function triggered: updateartist');

        // Check if the DB binding exists
        if (!context.env.DB) {
            throw new Error("DB binding not found");
        }

        // Extract data from the request
        const { userId, userName, firstName, lastName, about, socials, phoneNumber, location, artistFlag, isActive, isPublic } = await context.request.json();

        // Check if userId is provided
        if (!userId) {
            throw new Error("userId is required");
        }

        // Prepare the SQL statement for updating an artist
        const statement = `
            UPDATE user
            SET userName = ?, firstName = ?, lastName = ?, about = ?, socials = ?, phoneNumber = ?, location = ?, artistFlag = ?, isActive = ?, isPublic = ?
            WHERE userId = ?;
        `;

        // Execute the SQL statement
        const res = await context.env.DB.prepare(statement)
            .bind(userName, firstName, lastName, about, socials, phoneNumber, location, artistFlag, isActive, isPublic, userId)
            .run();

        // Check if the update was successful
        if (!res.success) {
            throw new Error("Failed to update artist");
        }

        // Return a success response
        return buildResponse(200, { message: 'Artist updated successfully' })
    } catch (error) {
        console.error(error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
}

export default allowCors(onRequestPost);