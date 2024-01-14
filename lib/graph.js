export class Graph {
  constructor() {
    this.vertices = new Map();
    this.verticesCount = 0;
    this.edgeCount = 0;
  }

  getVertexCount() {
    return Array.from(this.vertices.values()).length;
  }

  createCompositeKey(x, y, z) {
    return `${x},${y},${z}`;
  }

  // In addVertex method
  addVertex(x, y, z) {
    const key = this.createCompositeKey(x, y, z);
    if (!this.vertices.has(key)) {
      const newNode = new Node(x, y, z);
      this.vertices.set(key, newNode);
      this.verticesCount++;
    }
  }

  addEdgeWithNodes(vertex1, vertex2, distance, directed = false) {
    const key1 = this.createCompositeKey(...vertex1.getCoordinatesArray());
    const key2 = this.createCompositeKey(...vertex2.getCoordinatesArray());

    if (this.vertices.has(key1) && this.vertices.has(key2)) {
      this.vertices.get(key1).addNeighbor(vertex2, distance);
      if (!directed) {
        this.vertices.get(key2).addNeighbor(vertex1, distance); // For undirected graphs
      }
      this.edgeCount++;
    }
  }

  addEdgeWithCoords(x1, y1, z1, x2, y2, z2, distance, directed = false) {
    const key1 = this.createCompositeKey(x1, y1, z1);
    const key2 = this.createCompositeKey(x2, y2, z2);

    if (this.vertices.has(key1) && this.vertices.has(key2)) {
      this.vertices.get(key1).addNeighbor(this.vertices.get(key2), distance);
      if (!directed) {
        this.vertices.get(key2).addNeighbor(this.vertices.get(key1), distance); // For undirected graphs
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

  // LATER: If the closest distance is too great, then return null (cursor is too far from closest node)
  findNearestVertex(x, y, z) {
    let closestNode = null;
    let minDistance = Infinity;

    this.vertices.forEach((node) => {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) +
          Math.pow(y - node.y, 2) +
          Math.pow(z - node.z, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestNode = node;
      }
    });

    return closestNode;
  }

  clearGraph() {
    this.vertices = new Map();
  }

  calculateDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(
      Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
    );
  }

  findIfCoordsAlreadyExist(x, y, z) {
    const key = this.createCompositeKey(x, y, z);
    return this.vertices.has(key);
  }

  getNeighborsOf(vertexKey) {
    const vertex = this.vertices.get(vertexKey);
    return vertex ? vertex.getNeighbors() : [];
  }

  getDistanceBetween(vertexKey1, vertexKey2) {
    const vertex1 = this.vertices.get(vertexKey1);
    const vertex2 = this.vertices.get(vertexKey2);
    return vertex1 && vertex2
      ? this.calculateDistance(
          vertex1.x,
          vertex1.y,
          vertex1.z,
          vertex2.x,
          vertex2.y,
          vertex2.z
        )
      : Infinity;
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

  getVertex(coords) {
    return this.vertices.get(coords);
  }

  getVertexByKey(key) {
    return this.vertices.get(key);
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

  getRandomStart() {
    const verticesArray = Array.from(this.vertices.values());
    if (verticesArray.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * verticesArray.length);
    const randomVertex = verticesArray[randomIndex];
    return randomVertex.createCompositeKey();
  }
}

export class Node {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.neighbors = []; //contains an object containing the node and the distance to the node, {node: NODE, dist: DIST}
    this.visited = false;
  }

  getCoordinatesArray() {
    return [this.x, this.y, this.z];
  }

  createCompositeKey() {
    return `${this.x},${this.y},${this.z}`;
  }

  getNeighbors() {
    return this.neighbors;
  }

  setVisited(boolean) {
    this.visited = boolean;
  }

  getVisited(){
    return this.visited;
  }

  addNeighbor(neighborNode, distance) {
    this.neighbors.push({ node: neighborNode, dist: distance });
  }

  printNeighbors() {
    this.neighbors.forEach((vertex) => {
      console.log(
        `Neighbor: ${JSON.stringify(
          vertex.node.createCompositeKey()
        )} =-= Distance: ${vertex.dist}`
      );
    });
  }
}
