function reverseGeocode(lat, lon, apiKey) {
  return new Promise((resolve, reject) => {
    // Construct the request URL
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    // Make a request to the Geocoding API
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Check if the response status is OK
        if (data.status === "OK") {
          // Extract the formatted address from the results
          const address = data.results[0].formatted_address;
          resolve("Address:", address);
        } else {
          reject("Error:", data.status);
        }
      })
      .catch((error) => reject("Error:", error));
  });
}
