export class Node {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.neighbors = []; //contains an object containing the node and the distance to the node, {node: NODE, dist: DIST}
    
      // pathfinding-related qualities
      this.distanceFromStart = 0;
      this.distanceToEnd = 0;
      this.totalDistance = 0;
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
  
    getVisited() {
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