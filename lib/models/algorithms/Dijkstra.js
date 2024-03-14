import { haversineDistance } from "@/lib/utilities/geoUtils";
import PathfindingAlgorithm from "./PathfindingAlgorithm";

export default class Dijkstra extends PathfindingAlgorithm {
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
    this.graph.setToInfinity(); // Set all distanceFromStart to inf for dijkstra's
    this.startNode.distanceFromStart = 0;
    this.startNode.distanceToEnd = 0;
  }

  nextStep() {
    if (this.queue.length === 0) {
      this.finished = true;
      return [];
    }

    const toBeVisuallyUpdated = [];

    // Grab smallest distanced node from priority queue
    const currentNode = this.queue.shift();
    this.visited.add(currentNode.id);

    if (currentNode === this.endNode) {
      this.finalDistance = currentNode.distanceFromStart;
      this.queue = [];
      this.finished = true;
      return [];
    }

    for (const n of currentNode.getNeighbors()) {
      let neighborNode = n.node;

      const beenVisited = this.visited.has(neighborNode.id);

      if (!beenVisited) {
        const tentativeDistance = currentNode.distanceFromStart + n.dist;

        // Relaxation of nodes
        if (tentativeDistance < neighborNode.distanceFromStart) {
          neighborNode.distanceFromStart = tentativeDistance;
          this.predecessors.set(neighborNode.id, currentNode.id);
          neighborNode.distanceToEnd =
            haversineDistance(
              neighborNode.lat,
              neighborNode.lon,
              this.endNode.lat,
              this.endNode.lon
            ) * 1000;
        }

        if (!this.queue.includes(neighborNode)) {
          this.queue.push(neighborNode);
        }
      }

      toBeVisuallyUpdated.push([currentNode.id, neighborNode.id]);
    }

    // Return the nodes that need to be visually updated on the frontend
    // Can't return start since obviously, no line yet
    if (currentNode.id == this.startNode.id) {
      return [[currentNode.id]];
    } else {
      toBeVisuallyUpdated.push([
        this.predecessors.get(currentNode.id),
        currentNode.id,
      ]);
      // Return something so it doesn't crash algo
      return toBeVisuallyUpdated;
    }
  }
}
