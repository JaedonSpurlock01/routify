import PathfindingAlgorithm from "./pathfindingAlgorithm";
import { Graph } from "../graph";

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
    this.visted = [];
    this.startNode.distanceFromStart = 0;
    this.startNode.distanceToEnd = 0;
  }

  nextStep() {
    if (this.priorityQueue.length === 0) {
      this.finished = true;
      return [];
    }

    // Pop from priority queue
    const currentNode = this.priorityQueue.reduce(
      (acc, current) =>
        current.totalDistance < acc.totalDistance ? current : acc,
      this.priorityQueue[0]
    );

    // Remove from priority queue
    this.priorityQueue.splice(this.priorityQueue.indexOf(currentNode), 1);
    currentNode.visited = true;

    // Find the edge where the currentNode came from (Can't use startNode)
    let currentEdgeIndex, currentNodeCoords, previousNodeCoords;
    if (currentNode !== this.startNode) {
      currentNodeCoords = currentNode.createCompositeKey();
      previousNodeCoords = this.predecessors.get(currentNodeCoords);
      const coordinates1 = `[${currentNodeCoords}],[${previousNodeCoords}]`;
      const coordinates2 = `[${previousNodeCoords}],[${currentNodeCoords}]`;

      currentEdgeIndex =
        Graph.edgeToIndex.get(coordinates1) ??
        Graph.edgeToIndex.get(coordinates2);
    }

    if (currentNode === this.endNode) {
      this.priorityQueue = [];
      this.finished = true;
      return [];
    }

    for (const n of currentNode.getNeighbors()) {
      const neighbor = n.node;
      const neighborCurrentCost =
        currentNode.distanceFromStart +
        Math.hypot(neighbor.x - currentNode.x, neighbor.y - currentNode.y);

      if (this.priorityQueue.includes(neighbor)) {
        if (neighbor.distanceFromStart <= neighborCurrentCost) continue;
      } else if (this.visited.includes(neighbor)) {
        if (neighbor.distanceFromStart <= neighborCurrentCost) continue;
        this.visited.splice(this.visited.indexOf(neighbor), 1);
        this.priorityQueue.push(neighbor);
      } else {
        this.priorityQueue.push(neighbor);
        neighbor.distanceToEnd = Math.hypot(
          neighbor.x - currentNode.x,
          neighbor.y - currentNode.y
        );
      }

      neighbor.distanceFromStart = neighborCurrentCost;

      this.predecessors.set(neighbor.createCompositeKey(), currentNodeCoords);
    }

    this.visited.push(currentNode);
    return [currentEdgeIndex];
  }
}
