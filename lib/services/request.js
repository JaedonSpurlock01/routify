let backends = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.ru/cgi/interpreter",
];

export default function request(suggestion) {
  return new Promise((resolve, reject) => {
    let areaId;

    if (suggestion.osm_type === "relation") {
      areaId = suggestion.osm_id + 36e8;
    } else if (suggestion.osm_type === "way") {
      areaId = suggestion.osm_id + 24e8;
    }

    // Different types of filtering out lines
    // prettier-ignore
    const roadStrict = '[highway~"^(((motorway|trunk|primary|secondary|tertiary)(_link)?)|unclassified|residential|living_street|pedestrian|service|track)$"][area!=yes]';

    // prettier-ignore
    const roadBasic = '[highway~"^(motorway|primary|secondary|tertiary)|residential"]';
    const road = "[highway]";
    const building = "[building]";
    const allWays = "";

    const wayFilter = roadStrict;
    const timeout = 900;
    const maxHeapSize = 1073741824;
    const responseType = "geom";

    // OverpassQL query to filter and extract roads from Overpass API
    const queryString = `[timeout:${timeout}][maxsize:${maxHeapSize}][out:json];area(${areaId});(._; )->.area;(way${wayFilter}(area.area););out ${responseType};`;

    const postData = {
      method: "POST",
      responseType: "json",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "data=" + encodeURIComponent(queryString),
    };

    console.log("Sending request! 1");
    let req = new XMLHttpRequest();

    req.addEventListener("load", requestComplete);
    req.addEventListener("error", requestFailed);
    req.addEventListener("progress", updateProgress);

    req.open("POST", backends[0]);

    if (postData.responseType) {
      req.responseType = postData.responseType;
    }

    if (postData.headers) {
      Object.keys(postData.headers).forEach((key) => {
        req.setRequestHeader(key, postData.headers[key]);
      });
    }

    console.log("Sending request! 1");
    if (postData.method === "POST") {
      req.send(postData.body);
    } else {
      req.send(null);
    }

    function requestComplete() {
      var response = req.response;
      if (postData.responseType === "json") {
        resolve(response);
      }
    }

    function requestFailed() {
      reject(`Failed to download ${backends[0]}`);
    }

    function updateProgress(event) {
      console.log("Getting info...");
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(percentComplete);
      }
    }
  });
}
