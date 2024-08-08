import { verifyTokenId } from "@codehelios/verify-tokenid";

export async function verifyIdToken(context) {
  const token = context.request.headers.get("token");

  const { isValid, decoded, error } = await verifyTokenId(
    token,
    context.env.BASE_URL + context.env.PROJECT_ID,
    context.env.PROJECT_ID
  );

  return { isValid, decoded: decoded.payload.user_id, error };
}
