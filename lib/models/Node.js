export class Node {
  constructor(nodeID, lat, lon) {
    this.id = nodeID;
    this.lat = lat;
    this.lon = lon;
    this.neighbors = []; //contains an object containing the node and the distance to the node, {node: NODE, dist: DIST}

    // pathfinding-related qualities
    this.distanceFromStart = 0;
    this.distanceToEnd = 0;
    this.visited = false;
  }

  get totalDistance() {
    return this.distanceFromStart + this.distanceToEnd;
  }

  getFinalDistance() {
    return this.distanceFromStart;
  }

  getNeighbors() {
    return this.neighbors;
  }

  setVisited(boolean) {
    this.visited = boolean;
  }

  getVisited() {
    return this.visited;
  }

  addNeighbor(node, distance) {
    this.neighbors.push({ node: node, dist: distance });
  }

  reset() {
    this.distanceFromStart = 0;
    this.distanceToEnd = 0;
    this.visited = false;
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
