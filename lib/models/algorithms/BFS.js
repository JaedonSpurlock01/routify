import PathfindingAlgorithm from "./PathfindingAlgorithm";

export default class BFS extends PathfindingAlgorithm {
  constructor() {
    super();
    this.queue = [];
    this.predecessors = new Map();
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.queue = [startNode];
  }

  nextStep() {
    // If no path was found
    if (this.queue.length === 0) {
      this.finished = true;
      return [];
    }

    // Grab the next neighbor from the queue
    const currentNode = this.queue.shift();
    currentNode.visited = true;

    // Find the edge where the currentNode came from (Can't use startNode)
    let currentEdgeIndex, currentNodeCoords, previousNodeCoords;
    if (currentNode !== this.startNode) {
      currentNodeCoords = currentNode.createCompositeKey();
      previousNodeCoords = this.predecessors.get(currentNodeCoords);
      const coordinates1 = `[${currentNodeCoords}],[${previousNodeCoords}]`;
      const coordinates2 = `[${previousNodeCoords}],[${currentNodeCoords}]`;

      currentEdgeIndex =
        this.graph.edgeToIndex.get(coordinates1) ??
        this.graph.edgeToIndex.get(coordinates2);
    }

    // Path was found
    if (currentNode === this.endNode) {
      this.queue = [];
      this.finished = true;
      return [];
    }

    // Process each neighbor node, add to the queue if it hasn't been visited
    for (const n of currentNode.getNeighbors()) {
      if (!n.node.visited) this.queue.push(n.node);
      this.predecessors.set(n.node.createCompositeKey(), currentNodeCoords);
    }

    this.queue.push(currentNode);
    return [currentEdgeIndex];
  }
}
