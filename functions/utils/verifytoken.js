import { verifyTokenId } from "@codehelios/verify-tokenid";

export async function verifyIdToken(context) {
    const token = context.request.headers.get('Authorization').split('Bearer ')[1];

    const { isValid, decoded, error } = await verifyTokenId(token,
        context.env.BASE_URL + context.env.PROJECT_ID,
        context.env.PROJECT_ID);

    return { isValid, decoded, error }
}