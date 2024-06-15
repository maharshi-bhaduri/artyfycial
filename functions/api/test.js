import { verifyIdToken } from "../utils/verifytoken";

export async function onRequest(context) {

    const { isValid, decoded, error } = await verifyIdToken(context);

    return new Response(JSON.stringify({ message: isValid }), {
        headers: { 'Content-Type': 'application/json' },
    });
}