export class Graph {
  constructor() {
    this.vertices = new Map();
  }

  addVertex(vertex) {
    if (!this.vertices.has(vertex)) {
      this.vertices.set(vertex, []);
    }
  }

  addEdge(vertex1, vertex2) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      this.vertices.get(vertex1).push(vertex2);
      this.vertices.get(vertex2).push(vertex1); // for undirected graphs
    }
  }

  // Set a closest vertex variable
  // Iterate through the vertices, find the distance of input coordinates to it
  // if its closer than the variable, set the variable to the new vertex
  // LATER: If the closest distance is too great, then return null (cursor is too far from closest node)
  findNearestVertex(x, y) {
    return null;
  }
}
