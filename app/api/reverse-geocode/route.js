import reverseGeocode from "@/lib/services/geocoding";
import env from "dotenv";
env.config();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
    const addressFound = await reverseGeocode(
      lat,
      lon,
      process.env.NEXT_GEOAPIFY_KEY
    );
    if (addressFound.features[0].properties.formatted) {
      return new Response(
        JSON.stringify({
          address: addressFound.features[0].properties.formatted,
        })
      );
    } else {
      return new Response(JSON.stringify({ address: "" }));
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal System Error" }));
  }
}
