function latlonToXY(lat, lon, mapWidth, mapHeight) {
  var x = (lon + 180) * (mapWidth / 360);
  var latRad = (lat * Math.PI) / 180;
  var mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  var y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
  return [x, y];
}

const parseLineData = (jsonData, boundingbox) => {
  let returnArray = [];

  let north = boundingbox[0];
  let south = boundingbox[1];
  let east = boundingbox[2];
  let west = boundingbox[3];

  let mapWidth = Math.abs(east - west) * 450;
  let mapHeight = Math.abs(north - south) * 450;

  jsonData["elements"].forEach((obj) => {
    const currentList = obj["geometry"];

    for (let i = 0; i < currentList.length - 1; i++) {
      const start = latlonToXY(
        currentList[i].lat,
        currentList[i].lon,
        mapWidth,
        mapHeight
      );
      const end = latlonToXY(
        currentList[i + 1].lat,
        currentList[i + 1].lon,
        mapWidth,
        mapHeight
      );

      returnArray.push({ start, end });
    }
  });

  return returnArray;
};

export default parseLineData;
