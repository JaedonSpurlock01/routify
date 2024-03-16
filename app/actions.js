"use server";

import AWS from "aws-sdk";
import env from "dotenv";
env.config();

export async function saveCity(req) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_SECRET_KEY,
      region: "us-west-1",
    });

    const s3 = new AWS.S3();
    const input = await JSON.parse(req);

    const name = input.name;
    const date = input.date;
    const osm_id = input.osm_id;
    const nodes = input.nodes;
    const ways = input.ways;

    const newData = { name, date, osm_id, nodes, ways };

    // Uploading to S3
    const searchParams = {
      Bucket: "routify-serialized-city-data",
      Key: `${osm_id}`,
      Body: JSON.stringify(newData),
    };

    await s3.putObject(searchParams).promise();

    console.log(`SUCCESSFULLY CACHED [${name}] WITH OSM ID [${osm_id}]`);

    return {
      message: "cache successful",
    };
  } catch (error) {
    console.error("Error:", error);
  }
}
