// Mercator projection formula
export function convertToXY(lat, lon) {
  const earthRadius = 6371;

  var x = (lon + 180) * ((earthRadius * 2 * Math.PI) / 360);
  var latRad = (lat * Math.PI) / 180;
  var mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  var y = earthRadius * mercN;

  return [x, y];
}

export function milesToKilometers(number) {
  return number * 1.60934;
}

export function kilometersToMiles(number) {
  return number * 0.621371;
}

// Find distance in kilometers between two given lat-lon points
export function haversineDistance(lat1, lon1, lat2, lon2) {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert coordinates from degrees to radians
  const lonR1 = lon1 * (Math.PI / 180);
  const latR1 = lat1 * (Math.PI / 180);
  const lonR2 = lon2 * (Math.PI / 180);
  const latR2 = lat2 * (Math.PI / 180);

  // Calculate delta between points
  const lonD = lonR2 - lonR1;
  const latD = latR2 - latR1;

  // Haversine formula from https://en.wikipedia.org/wiki/Haversine_formula
  const a =
    Math.sin(latD / 2) * Math.sin(latD / 2) +
    Math.cos(latR1) * Math.cos(latR2) * Math.sin(lonD / 2) * Math.sin(lonD / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return R * c;
}
