import PathfindingAlgorithm from "./PathfindingAlgorithm";

export default class DFS extends PathfindingAlgorithm {
  constructor() {
    super();
    this.queue = [];
    this.visited = new Set();
    this.predecessors.clear();
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.queue = [startNode];
    this.visited.clear();
    this.predecessors.clear();
    this.startNode.distanceFromStart = 0;
    this.startNode.distanceToEnd = 0;
  }

  nextStep() {
    if (this.queue.length === 0) {
      this.finished = true;
      return [];
    }

    const toBeVisuallyUpdated = [];

    // Grab item from queue
    const currentNode = this.queue.pop();
    this.visited.add(currentNode.id);

    if (currentNode === this.endNode) {
      this.queue = [];
      this.finished = true;
      return [];
    }

    for (const n of currentNode.getNeighbors()) {
      let neighborNode = n.node;
      if (
        !this.visited.has(neighborNode.id) &&
        !this.queue.includes(neighborNode)
      ) {
        this.queue.push(neighborNode);
        this.predecessors.set(neighborNode.id, currentNode.id);
      } else {
        // Even though the node is already visited, the edge may not be visited yet
        toBeVisuallyUpdated.push([currentNode.id, neighborNode.id]);
      }
    }

    // Return the nodes that need to be visually updated on the frontend
    // Can't return start since obviously, no line yet
    if (currentNode.id == this.startNode.id) {
      // Return something so it doesn't crash algo
      return [[currentNode.id]];
    } else {
      toBeVisuallyUpdated.push([
        this.predecessors.get(currentNode.id),
        currentNode.id,
      ]);
      return toBeVisuallyUpdated;
    }
  }
}
