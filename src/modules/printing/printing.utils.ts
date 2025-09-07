import PrintingTokenModel from "./printing.model";

export async function getValidAccessTokenFromDB() {
  const tokenDoc = await PrintingTokenModel.findOne();
  if (!tokenDoc) throw new Error("No Epson token found for this user");

  if (tokenDoc.createdAt <= new Date()) {
    console.log("Token expired, refreshing...");

    const credentials = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    const refreshResponse = await fetch(
      "https://auth.epsonconnect.com/auth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: tokenDoc.refresh_token,
        }),
      }
    );

    const newToken = await refreshResponse.json();
    if (!newToken.access_token) throw new Error("Failed to refresh token");

    tokenDoc.access_token = newToken.access_token;
    tokenDoc.refresh_token = newToken.refresh_token;
    tokenDoc.expires_in = new Date(Date.now() + newToken.expires_in * 1000);

    await tokenDoc.save();
  }

  return tokenDoc.access_token;
}
