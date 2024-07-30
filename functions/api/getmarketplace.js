export async function onRequest(context) {
  try {
    console.log("Function triggered: getmarketplacedata");

    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }

    const statement = `SELECT item.marketplaceItemId,
    item.artworkId,item.valuation,item.minIncrement,
    art.artistId,art.title,art.description, art.path, 
    u.userName, u.firstName, u.lastName
    FROM 
    marketplace_item item 
    JOIN 
    artwork art ON item.artworkId = art.artworkId 
    JOIN user u ON art.artistId = u.userId  `;
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
