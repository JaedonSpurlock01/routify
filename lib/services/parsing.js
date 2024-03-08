// Extract the nodes and ways from the response
export function parseOverpassResponse(jsonData) {
  let nodes = [];
  let ways = [];

  jsonData["elements"].forEach((element) => {
    if (element.type === "node") {
      nodes.push({ id: element.id, lat: element.lat, lon: element.lon });
    } else if (element.type === "way") {
      ways.push({ nodes: element.nodes });
    }
  });

  return { nodes, ways };
}
