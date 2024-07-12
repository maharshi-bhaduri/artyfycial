export async function onRequest(context) {
  try {
    console.log("Function triggered: getportfoliodata");

    // Check if the DB binding exists
    if (!context.env.DB) {
      throw new Error("DB binding not found");
    }

    // Extract userName from the request
    const url = new URL(context.request.url);
    const userName = url.searchParams.get("userName");

    // Check if userName is provided
    if (!userName) {
      throw new Error("userName is required");
    }

    // Prepare the SQL statement to fetch artworks by userName
    const statement = `
            SELECT *
            from user u
            left join artwork a on u.userId = a.artistId
            WHERE userName = ?;`

    // Execute the SQL statement
    const res = await context.env.DB.prepare(statement).bind(userName).all();

    // Check if the query was successful and results are available
    if (!res || !res.results) {
      throw new Error("No artworks found for the given userName");
    }

    // Segregate artist and artwork data
    const artist = {
      userId: res.results[0].userId,
      userName: res.results[0].userName,
      uid: res.results[0].uid,
      lastLoginDate: res.results[0].lastLoginDate,
      firstName: res.results[0].firstName,
      lastName: res.results[0].lastName,
      about: res.results[0].about,
      socials: res.results[0].socials,
      phoneNumber: res.results[0].phoneNumber,
      location: res.results[0].location,
      joinDate: res.results[0].joinDate,
      isPublic: res.results[0].isPublic,
      artistFlag: res.results[0].artistFlag,
      profilePicturePath: res.results[0].profilePicturePath,
      isActive: res.results[0].isActive
    };

    const artworks = res.results.map(artwork => ({
      artworkId: artwork.artworkId,
      artistId: artwork.artistId,
      title: artwork.title,
      uploadDate: artwork.uploadDate,
      description: artwork.description,
      isActive: artwork.isActive,
      path: artwork.path,
      isPublic: artwork.isPublic,
      clickCount: artwork.clickCount,
    }));


    const portfolio = { artist, artworks }

    // Return a JSON response with the artworks
    return new Response(JSON.stringify(portfolio), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
