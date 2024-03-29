import PathfindingAlgorithm from "./algorithms/PathfindingAlgorithm";
import AStar from "./algorithms/AStar";
import BFS from "./algorithms/BFS";
import DFS from "./algorithms/DFS";
import Greedy from "./algorithms/Greedy";
import Dijkstra from "./algorithms/Dijkstra";

export default class PathfindingInstance {
  static #instance;

  constructor() {
    if (!PathfindingInstance.#instance) {
      this.startNode = null;
      this.endNode = null;
      this.graph = null;
      this.finished = false;
      this.finalDistance = 0;
      this.algorithm = new PathfindingAlgorithm();
      PathfindingInstance.#instance = this;
    }

    return PathfindingInstance.#instance;
  }

  setStartNode(startNode) {
    this.startNode = startNode;
  }

  getFinalDistance() {
    if (this.algorithm.finalDistance > 0) {
      return this.algorithm.finalDistance.toFixed(3);
    }
    return -1;
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
    this.finalDistance = 0;
    this.graph.resetVertices();
    this.algorithm = new PathfindingAlgorithm();
    if (!this.graph) return;
  }

  start(algorithm) {
    this.reset();
    switch (algorithm) {
      case "A* Search":
        this.algorithm = new AStar();
        break;
      case "Breadth-First Search":
        this.algorithm = new BFS();
        break;
      case "Greedy Search":
        this.algorithm = new Greedy();
        break;
      case "Depth-First Search":
        this.algorithm = new DFS();
        break;
      case "Dijkstra's Search":
        this.algorithm = new Dijkstra();
        break;
      default:
        this.algorithm = new AStar();
    }

    this.algorithm.setGraph(this.graph);
    this.algorithm.start(this.startNode, this.endNode);
  }

  nextStep() {
    // Grab the next edge to be updated
    const way = this.algorithm.nextStep();
    if (this.algorithm.finished || way.length === 0) {
      this.finished = true;
      return null;
    }
    return way;
  }
}
