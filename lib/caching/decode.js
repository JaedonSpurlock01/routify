let map = require("./map_pb").map;

// Decode function
export default function decodeMap(buffer) {
  return new Promise((resolve, reject) => {
    // Decode the buffer to a Map message
    try {
      let message2 = map.deserializeBinary(buffer);

      // Convert the message to a plain JavaScript object
      const decodedData = message2.toObject();

      // Map linesList to replace coordinate objects with arrays
      decodedData.linesList = decodedData.linesList.map((line) => ({
        start: [line.start.x, line.start.y],
        end: [line.end.x, line.end.y],
      }));

      console.log("Successfully decoded data");

      resolve(decodedData);
    } catch (exception) {
      console.log("Could not properly deserialize binary data");
      console.log("Full Error: ", exception);
      reject("Unable to decode");
    }
  });
}
