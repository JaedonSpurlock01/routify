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

    // Grab smallest distanced node from priority queue
    const currentNode = this.priorityQueue.reduce(
      (acc, current) =>
        current.totalDistance < acc.totalDistance ? current : acc,
      this.priorityQueue[0]
    );

    // Remove from priority queue
    this.priorityQueue.splice(this.priorityQueue.indexOf(currentNode), 1);
    this.visited.push(currentNode.id);

    // Find the edge where the currentNode came from (Can't use startNode)
    let currentEdgeIndex;
    if (currentNode !== this.startNode) {
      let previousNodeID = this.predecessors.get(currentNode.id);
      const way1 = [currentNode.id, previousNodeID].join(",");
      const way2 = [previousNodeID, currentNode.id].join(",");

      currentEdgeIndex =
        this.graph.edgeToIndex.get(way1) ?? this.graph.edgeToIndex.get(way2);
    }

    if (currentNode === this.endNode) {
      console.log("DISTANCE FOUND: ", currentNode.distanceFromStart, " meters");
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

    return [currentEdgeIndex];
  }
}
