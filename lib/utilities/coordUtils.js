export function latlonToXY(lat, lon, mapWidth, mapHeight) {
  var x = (lon + 180) * (mapWidth / 360);
  var latRad = (lat * Math.PI) / 180;
  var mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  var y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
  return [x, y];
}

export function xyToLatLon(x, y, mapWidth, mapHeight) {
  var lon = (x / mapWidth) * 360 - 180;
  var mercN = (mapHeight / 2 - y) / (mapWidth / (2 * Math.PI));
  var latRad = Math.atan(Math.exp(mercN)) * 2 - Math.PI / 2;
  var lat = (latRad * 180) / Math.PI;
  return [lat, lon];
}
