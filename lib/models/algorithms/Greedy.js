import { haversineDistance } from "@/lib/utilities/geoUtils";
import PathfindingAlgorithm from "./PathfindingAlgorithm";

export default class Greedy extends PathfindingAlgorithm {
  constructor() {
    super();
    this.priorityQueue = [];
    this.visited = new Set();
    this.predecessors = new Map();
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.priorityQueue = [startNode];
    this.visited.clear();
    this.predecessors.clear();
    this.startNode.distanceFromStart = 0;
    this.startNode.distanceToEnd = 0;
  }

  nextStep() {
    if (this.priorityQueue.length === 0) {
      this.finished = true;
      return [];
    }

    const toBeVisuallyUpdated = [];

    // Grab smallest distanced node from priority queue
    const currentNode = this.priorityQueue.reduce(
      (acc, current) =>
        current.distanceToEnd < acc.distanceToEnd ? current : acc,
      this.priorityQueue[0]
    );

    // Remove from priority queue
    this.priorityQueue.splice(this.priorityQueue.indexOf(currentNode), 1);
    this.visited.add(currentNode.id);

    if (currentNode === this.endNode) {
      this.finalDistance = currentNode.distanceFromStart;
      this.priorityQueue = [];
      this.finished = true;
      return [];
    }

    for (const n of currentNode.getNeighbors()) {
      let neighborNode = n.node;
      const beenVisited = this.visited.has(neighborNode.id);

      if (beenVisited) {
        // Even though the node is already visited, the edge may not be visited yet
        toBeVisuallyUpdated.push([currentNode.id, neighborNode.id]);
      } else {
        neighborNode.distanceToEnd =
          haversineDistance(
            neighborNode.lat,
            neighborNode.lon,
            this.endNode.lat,
            this.endNode.lon
          ) * 1000;
        neighborNode.distanceFromStart = currentNode.distanceFromStart + n.dist;
        this.priorityQueue.push(neighborNode);
        this.predecessors.set(neighborNode.id, currentNode.id);
      }
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
