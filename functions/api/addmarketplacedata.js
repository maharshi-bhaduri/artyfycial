export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export const buildResponse = (status, data) => {
  const headers = new Headers({
    ...corsHeaders,
    "Content-Type": "application/json",
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
    console.log("hello from cors. incoming function: ", fn);

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
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
export async function onRequestPost(context) {
  try {
    console.log("Add to marketplace function triggered");

    // Check if the DB binding exists
    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }
    // Extract data from the request
    const { artworkId, valuation, minIncrement } = await context.request.json();
    if (!artworkId) {
      throw new Error("Artwork ID is required");
    }
    const statement = `INSERT INTO marketplace_item (artworkId,valuation,minIncrement) VALUES (?,?,?)`;
    const result = await context.env.DB.prepare(statement)
      .bind(artworkId, valuation, minIncrement)
      .run();
    if (!result.success) {
      throw new Error("Failed to add record to marketplace");
    }
    return buildResponse(200, { marketplaceId: result.meta.last_row_id });
  } catch (error) {
    console.error(error);
    return buildResponse(500, { message: "Internal Server Error" });
  }
}

export default allowCors(onRequestPost);
