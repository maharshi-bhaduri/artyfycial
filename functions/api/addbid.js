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
    console.log("Add to bid table function triggered");

    // Check if the DB binding exists
    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }
    // Extract data from the request
    const { parentRefId, artworkId, bidderId, bidAmount, bidTime } =
      await context.request.json();
    if (!parentRefId || !artworkId || !bidderId || !bidAmount || !bidTime) {
      throw new Error(
        "parentRef Id or Artwork ID or bidderId or bidAmount or bidTime is missing. All of these are mandatory"
      );
    }
    const statement = `INSERT INTO bid (parentRefId, artworkId,bidderId, bidAmount, bidTime) VALUES (?,?,?,?,?)`;
    const result = await context.env.DB.prepare(statement)
      .bind(parentRefId, artworkId, bidderId, bidAmount, bidTime)
      .run();
    if (!result.success) {
      throw new Error("Failed to add bid");
    }
    return buildResponse(200, { bidId: result.meta.last_row_id });
  } catch (error) {
    console.error(error);
    return buildResponse(500, { message: "Internal Server Error" });
  }
}

export default allowCors(onRequestPost);
