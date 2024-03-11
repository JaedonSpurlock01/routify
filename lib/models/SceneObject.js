import * as THREE from "three";
import { addLineOnMesh, convertToXY } from "../utilities/geoUtils";

// Define line geometry for threeJS scene
export const lineBaseSegment = new THREE.Shape();
lineBaseSegment.moveTo(0, 0.5);
lineBaseSegment.lineTo(1, 0.5);
lineBaseSegment.lineTo(1, -0.5);
lineBaseSegment.lineTo(0, -0.5);
lineBaseSegment.lineTo(0, 0.5);

export class SceneObject {
  constructor(defaultColor, defaultLineWidth, boundingBox) {
    this.defaultColor = defaultColor;
    this.defaultLineWidth = defaultLineWidth;
    this.lineSegments = [];
    this.nodes = new Map();
    this.lineCount = 0;
    this.nodeCount = 0;

    this.boundingBox = boundingBox;
    this.northBound = Number(boundingBox[0]);
    this.southBound = Number(boundingBox[1]);
    this.eastBound = Number(boundingBox[2]);
    this.westBound = Number(boundingBox[3]);
  }

  // Add a node formatted with mercator project points
  addNode(node) {
    this.nodes.set(node.id, {
      projected: convertToXY(node.lat, node.lon),
      unprojected: [node.lat, node.lon],
    });
    this.nodeCount += 1;
  }

  // Return the node referenced by the node ID
  getNode(nodeID) {
    return this.nodes.get(nodeID);
  }

  getLineCount() {
    return this.lineCount;
  }

  // Calculate needed properties to render line on THREE mesh
  createLineProperty(x1, y1, x2, y2, startID, endID) {
    const startVector = new THREE.Vector3(x1, y1, 0);
    const endVector = new THREE.Vector3(x2, y2, 0);
    const length = endVector.distanceTo(startVector);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    this.lineSegments.push({
      x: x1 - this.center.x,
      y: y1 - this.center.y,
      length,
      dx,
      dy,
      angle,
      startID,
      endID,
    });

    this.lineCount += 1;
  }

  findNearestNode(x, y) {
    let nearestNodeID = null;
    let nearestNodeXY = null;
    let minDistance = Infinity;

    this.nodes.forEach((node, key) => {
      const distance = Math.sqrt(
        Math.pow(x - (node.projected[0] - this.center.x), 2) +
          Math.pow(y - (node.projected[1] - this.center.y), 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestNodeID = key;
        nearestNodeXY = [
          node.projected[0] - this.center.x,
          node.projected[1] - this.center.y,
        ];
      }
    });

    return {
      id: nearestNodeID,
      x: nearestNodeXY[0],
      y: nearestNodeXY[1],
    };
  }

  updateScene(meshRef, lineMap = null, colorHex = null) {
    if (!meshRef.current || !meshRef) return;
    let currentIndex = 0;

    this.lineSegments.forEach((lineSegment) => {
      addLineOnMesh({
        x: lineSegment.x,
        y: lineSegment.y,
        z: 0,
        length: lineSegment.length,
        angle: lineSegment.angle,
        colorHex: colorHex ? colorHex : this.defaultColor,
        width: this.defaultLineWidth,
        lineMesh: meshRef.current,
        index: currentIndex,
      });

      if (lineMap) {
        lineMap.set(
          [lineSegment.startID, lineSegment.endID].join(","),
          currentIndex
        );
      }

      currentIndex += 1;
    });
  }

  // Calculate the center offset to center the THREE scene
  calculateMapCenterA() {
    const latCenter = (this.northBound + this.southBound) / 2;
    const lonCenter = (this.eastBound + this.westBound) / 2;
    const convertedXY = convertToXY(
      latCenter,
      lonCenter,
      this.mapWidth,
      this.mapHeight
    );

    this.center = {
      x: convertedXY[0],
      y: convertedXY[1],
    };

    return {
      x: convertedXY[0],
      y: convertedXY[1],
    };
  }

  calculateMapCenter() {
    let sumX = 0,
      sumY = 0;

    this.nodes.forEach((node) => {
      sumX += node.projected[0];
      sumY += node.projected[1];
    });

    this.center = {
      x: sumX / this.nodeCount,
      y: sumY / this.nodeCount,
    };

    return {
      x: sumX / this.nodeCount,
      y: sumY / this.nodeCount,
    };
  }
}
