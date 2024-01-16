import { addLineToMesh } from "../utilities/mapUtils";

export function breadthFirstSearch(graph, sceneObject, lineMesh) {
  if (!graph.getVertexCount()) return;

  const startCoords = graph.getRandomStart();
  if (startCoords === null) {
    console.log("something isn't working right");
    return;
  }

  const bfsQueue = [];
  const predecessors = new Map();

  graph
    .getVertex(startCoords)
    .getNeighbors()
    .forEach((neighbor) => {
      bfsQueue.push(neighbor);
      predecessors.set(neighbor.node.createCompositeKey(), startCoords);
    });

  graph.getVertex(startCoords).setVisited(true);

  const processQueue = () => {
    if (!bfsQueue.length) return;

    const current_vertex = bfsQueue.pop();
    current_vertex.node.setVisited(true);

    const current_vertex_coords = current_vertex.node.createCompositeKey();
    const previous_vertex_coords = predecessors.get(current_vertex_coords);

    const coordinates1 = `[${current_vertex_coords}],[${previous_vertex_coords}]`;
    const coordinates2 = `[${previous_vertex_coords}],[${current_vertex_coords}]`;

    const current_index =
      graph.edgeToIndex.get(coordinates1) ??
      graph.edgeToIndex.get(coordinates2);
    const current_edge = sceneObject.segmentProps[current_index];

    if (current_edge) {
      addLineToMesh(
        lineMesh.current,
        sceneObject.tempObject,
        sceneObject.objectColor,
        current_edge.coords,
        current_edge.computedData,
        current_index,
        true,
        0.00001,
        sceneObject.lineWidth
      );

      current_vertex.node.getNeighbors().forEach((neighbor) => {
        if (!predecessors.has(neighbor.node.createCompositeKey())) {
          if (!neighbor.node.getVisited()) {
            bfsQueue.push(neighbor);
            predecessors.set(
              neighbor.node.createCompositeKey(),
              current_vertex_coords
            );
          }
        }
      });
    }

    // Call processQueue again after a delay
    setTimeout(processQueue, 1); // Adjust the delay time as needed
  };

  processQueue();
}
