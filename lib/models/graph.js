import { Node } from "./Node";

export class Graph {
  static #instance;

  constructor() {
    if (!Graph.#instance) {
      this.vertices = new Map();
      this.edgeToIndex = new Map();
      this.verticesCount = 0;
      this.edgeCount = 0;
      this.centerX = 0;
      this.centerY = 0;
      this.algorithmSpeed = 10;
      Graph.#instance = this;
    }

    return Graph.#instance;
  }

  setAlgorithmSpeed(num) {
    this.algorithmSpeed = num;
  }

  // Reset the vertices for re-use of pathfinding
  resetVertices() {
    this.vertices.forEach((vertex) => vertex.reset());
  }

  setCenter(x, y) {
    this.centerX = x;
    this.centerY = y;
  }

  getVertexCount() {
    return Array.from(this.vertices.values()).length;
  }

  // In addVertex method
  addVertex(nodeID, lat, lon) {
    if (!this.vertices.has(nodeID)) {
      const newNode = new Node(nodeID, lat, lon);
      this.vertices.set(nodeID, newNode);
      this.verticesCount++;
    }
  }

  addEdge(startNodeID, endNodeID, distance, directed = false) {
    if (this.vertices.has(startNodeID) && this.vertices.has(endNodeID)) {
      this.vertices
        .get(startNodeID)
        .addNeighbor(this.getVertex(endNodeID), distance);
      if (!directed) {
        this.vertices
          .get(endNodeID)
          .addNeighbor(this.getVertex(startNodeID), distance); // For undirected graphs
      }
      this.edgeCount++;
    }
  }

  printAll() {
    this.vertices.forEach((vertex, key) => {
      console.log(JSON.stringify(key));
      vertex.printNeighbors();
      console.log("\n\n");
    });

    console.log("TOTAL VERTICES: ", this.verticesCount);
    console.log("TOTAL EDGES: ", this.edgeCount);
  }

  clearGraph() {
    this.vertices = new Map();
  }

  getNeighborsOf(vertexKey) {
    const vertex = this.vertices.get(vertexKey);
    return vertex ? vertex.getNeighbors() : [];
  }

  getVertices() {
    return this.vertices;
  }

  getEdges() {
    const edges = [];
    this.vertices.forEach((vertex, key) => {
      vertex.getNeighbors().forEach((neighbor) => {
        edges.push({
          from: key,
          to: neighbor.node.getCoordinatesArray(),
          distance: neighbor.dist,
        });
      });
    });
    return edges;
  }

  getVertex(NodeID) {
    return this.vertices.get(NodeID);
  }

  reconstructPath(cameFrom, startKey, endKey) {
    let currentKey = endKey;
    const path = [];
    while (currentKey !== startKey) {
      path.unshift(currentKey);
      currentKey = cameFrom[currentKey];
    }
    path.unshift(startKey);
    return path;
  }
}
