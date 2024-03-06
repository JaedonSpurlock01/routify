import PathfindingAlgorithm from "./algorithms/PathfindingAlgorithm";
import AStar from "./algorithms/AStar";
import BFS from "./algorithms/BFS";

export default class PathfindingInstance {
  static #instance;

  constructor() {
    if (!PathfindingInstance.#instance) {
      this.startNode = null;
      this.endNode = null;
      this.graph = null;
      this.finished = false;
      this.algorithm = new PathfindingAlgorithm();
      PathfindingInstance.#instance = this;
    }

    return PathfindingInstance.#instance;
  }

  setStartNode(startNode) {
    this.startNode = startNode;
  }

  setEndNode(endNode) {
    this.endNode = endNode;
  }

  setGraph(graph) {
    this.graph = graph;
  }

  getPredecessors() {
    return this.algorithm.predecessors ?? null;
  }

  reset() {
    this.finished = false;
    this.algorithm = new PathfindingAlgorithm();
    if (!this.graph) return;
  }

  start() {
    this.reset();
    this.algorithm = new AStar();
    this.algorithm.setGraph(this.graph);
    this.algorithm.start(this.startNode, this.endNode);
  }

  nextStep() {
    // Grab the next edge to be updated
    const edgeIndex = this.algorithm.nextStep();
    if (this.algorithm.finished || edgeIndex.length === 0) {
      this.finished = true;
      return null;
    }

    return edgeIndex[0];
  }
}
