import { haversineDistance } from "@/lib/utilities/geoUtils";
import PathfindingAlgorithm from "./PathfindingAlgorithm";

export default class AStar extends PathfindingAlgorithm {
  constructor() {
    super();
    this.priorityQueue = [];
    this.visited = [];
    this.predecessors = new Map();
  }

  start(startNode, endNode) {
    super.start(startNode, endNode);
    this.priorityQueue = [startNode];
    this.visited = [];
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
        current.totalDistance < acc.totalDistance ? current : acc,
      this.priorityQueue[0]
    );

    // Remove from priority queue
    this.priorityQueue.splice(this.priorityQueue.indexOf(currentNode), 1);
    this.visited.push(currentNode.id);

    if (currentNode === this.endNode) {
      this.finalDistance = currentNode.distanceFromStart;
      this.priorityQueue = [];
      this.finished = true;
      return [];
    }

    for (const n of currentNode.getNeighbors()) {
      let neighborNode = n.node;
      const tentativeDistance = currentNode.distanceFromStart + n.dist;
      const beenVisited = this.visited.includes(neighborNode.id);

      if (this.priorityQueue.includes(neighborNode)) {
        if (neighborNode.distanceFromStart <= tentativeDistance) continue;
      } else if (beenVisited) {
        // Even though the node is already visited, the edge may not be visited yet
        toBeVisuallyUpdated.push([currentNode.id, neighborNode.id]);
        if (neighborNode.distanceFromStart <= tentativeDistance) continue;
        this.visited.splice(this.visited.indexOf(neighbor.id), 1);
        this.priorityQueue.push(neighborNode);
      } else {
        this.priorityQueue.push(neighborNode);
        neighborNode.distanceToEnd =
          haversineDistance(
            neighborNode.lat,
            neighborNode.lon,
            this.endNode.lat,
            this.endNode.lon
          ) * 1000;
      }

      // Does not always reach here, can be skipped by "continue"
      neighborNode.distanceFromStart = tentativeDistance;
      this.predecessors.set(neighborNode.id, currentNode.id);
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
