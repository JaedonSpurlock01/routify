export class Graph {
  constructor() {
    this.vertices = new Map();
  }

  createCompositeKey(x, y, z) {
    return `(${x}, ${y}, ${z})`;
  }

  // In addVertex method
  addVertex(x, y, z) {
    const key = createCompositeKey(x, y, z);
    if (!this.vertices.has(key)) {
      const newNode = new Node(x, y, z);
      this.vertices.set(key, newNode);
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
    }
  }

  addEdgeWithCoords(vertex1Array, vertex2Array, distance, directed = false) {
    const key1 = this.createCompositeKey(...vertex1Array);
    const key2 = this.createCompositeKey(...vertex2Array);

    if (this.vertices.has(key1) && this.vertices.has(key2)) {
      this.vertices.get(key1).addNeighbor(vertex2, distance);
      if (!directed) {
        this.vertices.get(key2).addNeighbor(vertex1, distance); // For undirected graphs
      }
    }
  }

  printVertices() {
    this.vertices.forEach((value, key) => {
      console.log(key, ":\n", value.printNeighbors, "\n\n");
    });
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
}

export class Node {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.neighbors = []; //contains an object containing the node and the distance to the node, {node: NODE, dist: DIST}
  }

  getCoordinatesArray() {
    return [x, y, z];
  }

  getCoordinatesObject() {
    return { x, y, z };
  }

  getNeighbors() {
    return this.neighbors;
  }

  addNeighbor(neighborNode, distance) {
    this.neighbors.push({ node: neighborNode, dist: distance });
  }

  printNeighbors() {
    this.neighbors.forEach((obj) => {
      console.log("Neighbor: ", obj.node, "Distance: ", obj.dist);
    });
  }
}
