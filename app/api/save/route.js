import encodeMap from "@/lib/caching/encode";
import AWS from "aws-sdk";
import env from "dotenv";
env.config();

export async function POST(req) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_SECRET_KEY,
      region: "us-west-1",
    });

    const s3 = new AWS.S3();
    const input = await req.json();

    const name = input.name;
    const date = input.date;
    const osm_id = input.osm_id;
    const linesList = input.linesList;

    // Encoding map
    const binary_data = await encodeMap(name, date, osm_id, linesList);

    // Uploading to S3
    const searchParams = {
      Bucket: "routify-serialized-city-data",
      Key: `${osm_id}`,
      Body: binary_data,
    };

    await s3.putObject(searchParams).promise();

    console.log("Binary data uploaded successfully");
    // Returning a response
    return new Response(
      "Saved to database: " + name + ", " + date + ", " + osm_id
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal System Error" }));
  }
}
