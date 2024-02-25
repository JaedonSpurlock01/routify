import decodeMap from "@/lib/caching/decode";
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
    const osm_id = input.suggestion.osm_id;

    // Initialize search parameters to find the city in S3
    const searchParams = {
      Bucket: "routify-serialized-city-data",
      Key: `${osm_id}`,
    };

    try {
      // If it is in the database, download it
      const dbRequest = s3.getObject(searchParams);

      const data = await new Promise((resolve, reject) => {
        dbRequest.send((err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const decodedData = await decodeMap(data.Body);
      return new Response(JSON.stringify(decodedData));
    } catch (error) {
      return new Response(JSON.stringify({ response: "no-cache" }));
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal System Error" }));
  }
}
