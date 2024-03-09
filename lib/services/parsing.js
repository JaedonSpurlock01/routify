// Extract the nodes and ways from the response
export function parseOverpassResponse(jsonData) {
  let nodes = [];
  let ways = [];

  jsonData["elements"].forEach((element) => {
    if (element.type === "node") {
      nodes.push({ id: element.id, lat: element.lat, lon: element.lon });
    } else if (element.type === "way") {
      ways.push([...element.nodes]);
    }
  });

  return { nodes, ways };
}

// Returns a json formatted list of nodes and objects
/*
{
  nodes: [
    {id, lat, lon}, {id, lat, lon}, {id, lat, lon}, ...
  ],
  ways: [
    [id, id2, id3], [id, id2, id3]
  ]
}
*/
