let map = require("./map_pb").map;
let line = require("./map_pb").line;
let coordinate = require("./map_pb").coordinate;

export default function encodeMap(name, date, id, linesList) {
  return new Promise((resolve, reject) => {
    const message = new map();

    // Create a new Map message instance
    message.setName(name);
    message.setDate(date);
    message.setId(id);

    linesList.forEach((obj) => {
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

    console.log("Successfully encoded data: ", buffer);
    resolve(buffer);
  });
}
