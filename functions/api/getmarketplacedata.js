export async function onRequest(context) {
  try {
    console.log("Function triggered: getmarketplacedata");

    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }

    const statement = `SELECT * from marketplace_item`;
    const res = await context.env.DB.prepare(statement).all();

    if (!res || !res.results) throw new Error("No marketplace items found");

    const marketplaceItems = res.results;

    return new Response(JSON.stringify(marketplaceItems), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
