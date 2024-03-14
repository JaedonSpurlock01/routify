export default class PathfindingAlgorithm {
  constructor() {
    this.finished = false;
    this.predecessors = new Map();
  }

  setGraph(graph) {
    this.graph = graph;
  }

  start(startNode, endNode) {
    this.finished = false;
    this.startNode = startNode;
    this.endNode = endNode;
  }

  nextStep() {
    return [];
  }
}
