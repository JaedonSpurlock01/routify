import * as THREE from "three";
import { AddLineOnMesh, convertToXY } from "../utilities/geoUtils";

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

    this.northBound = boundingBox[0];
    this.southBound = boundingBox[1];
    this.eastBound = boundingBox[2];
    this.westBound = boundingBox[3];

    this.boundingBox = boundingBox;
    this.mapWidth = Math.abs(this.eastBound - this.westBound) * 450;
    this.mapHeight = Math.abs(this.northBound - this.southBound) * 450;
  }

  // Add a node formatted with mercator project points
  addNode(node) {
    this.nodes.set(
      node.id,
      convertToXY(node.lat, node.lon, this.mapWidth, this.mapHeight)
    );
  }

  // Return the node referenced by the node ID
  getNode(nodeID) {
    return this.nodes.get(nodeID);
  }

  // Calculate needed properties to render line on THREE mesh
  createLineProperty(x1, y1, x2, y2, center, startID, endID) {
    const startVector = new THREE.Vector3(x1, y1, z_index);
    const endVector = new THREE.Vector3(x2, y2, z_index);
    const length = endVector.distanceTo(startVector);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    this.lineSegments.push({
      x1: x1 - center.x,
      y1: y1 - center.y,
      length,
      dx,
      dy,
      angle,
      startID,
      endID,
    });

    this.lineCount += 1;
  }

  updateScene(meshRef, lineMap = null, colorHex = null) {
    if (!meshRef.current || !meshRef) return;
    let currentIndex = 0;

    this.lineSegments.forEach((lineSegment) => {
      AddLineOnMesh({
        x: lineSegment.x,
        y: lineSegment.y,
        z: 0,
        length: lineSegment.length,
        angle: lineSegment.angle,
        colorHex,
        width: this.defaultLineWidth,
        lineMesh: meshRef,
        index: currentIndex,
      });

      if (lineMap) {
        lineMap.set([startID, endID].join(","), currentIndex);
      }
    });
  }

  // Calculate the center offset to center the map
  calculateMapCenter() {
    const latCenter = (this.northBound + this.southBound) / 2;
    const lonCenter = (this.eastBound + this.westBound) / 2;
    const convertedXY = convertToXY(
      latCenter,
      lonCenter,
      this.mapWidth,
      this.mapHeight
    );
    return {
      x: convertedXY[0],
      y: convertedXY[1],
    };
  }
}
