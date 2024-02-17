let map = require("C:/Users/dextr/routify/routify/lib/caching/map_pb.js").map;
let line = require("C:/Users/dextr/routify/routify/lib/caching/map_pb.js").line;
let coordinate =
  require("C:/Users/dextr/routify/routify/lib/caching/map_pb.js").coordinate;

const message = new map();

// Encode function
function encodeMap(mapData) {
  // Create a new Map message instance
  message.setName(mapData.name);
  message.setDate(mapData.date);
  message.setId(mapData.id);

  mapData.lines.forEach((obj) => {
    const start = new coordinate();
    start.setX(obj.start[0]);
    start.setY(obj.start[1]);

    const end = new coordinate();
    end.setX(obj.end[0]);
    end.setY(obj.end[1]);

    const newLine = new line();
    newLine.setStart(start);
    newLine.setEnd(end);

    message.addLines(newLine);
  });

  // Encode the message to a buffer
  let buffer = message.serializeBinary();
  return buffer;
}

// Decode function
function decodeMap(buffer) {
  // Decode the buffer to a Map message
  const message2 = map.deserializeBinary(buffer);

  // Convert the message to a plain JavaScript object
  const decodedData = message2.toObject();

  // Map linesList to replace coordinate objects with arrays
  decodedData.linesList = decodedData.linesList.map((line) => ({
    start: [line.start.x, line.start.y],
    end: [line.end.x, line.end.y],
  }));

  return decodedData;
}

// Example usage
const mapData = {
  name: "Sample Map",
  date: "2024-02-16",
  id: 12345,
  lines: [
    {
      start: [1.0, 2.0],
      end: [3.0, 4.0],
    },
    {
      start: [5.0, 6.0],
      end: [7.0, 8.0],
    },
  ],
};

// Encode the map data
const encodedData = encodeMap(mapData);
console.log("Encoded Data:", encodedData);

// Decode the encoded data
const decodedData = decodeMap(encodedData);
console.log("Decoded Data:", decodedData);

console.log("TESTING: ", decodedData.linesList[0].start)