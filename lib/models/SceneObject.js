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
    this.lineSegments = new Map();
    this.nodes = new Map();
    this.lineCount = 0;
    this.nodeCount = 0;
    this.indexReference = new Map();

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

  changeColor(newColorHex) {
    this.defaultColor = newColorHex;
  }

  // Calculate needed properties to render line on THREE mesh
  createLineProperty(x1, y1, x2, y2, startID, endID) {
    const startVector = new THREE.Vector3(x1, y1, 0);
    const endVector = new THREE.Vector3(x2, y2, 0);
    const length = endVector.distanceTo(startVector);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    const newKey = [startID, endID].join("");

    if (this.indexReference.get(newKey)) {
      console.log("DUPLICATE LINE! IGNORING LINE");
    } else {
      this.lineSegments.set(newKey, {
        x: x1 - this.center.x,
        y: y1 - this.center.y,
        length,
        dx,
        dy,
        angle,
      });

      this.indexReference.set(newKey, this.lineCount);
      this.lineCount += 1;
    }
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

  updateScene(meshRef, colorHex = null, lineWidth = null) {
    if (!meshRef.current || !meshRef) return;

    const mesh = meshRef.current;

    this.lineSegments.forEach((lineSegment, key) => {
      let index = this.indexReference.get(key);

      // If somehow, the key doesnt exist. Then we can just set the index reference to the line
      if (!index && index !== 0) {
        this.lineCount += 1;
        index = this.lineCount;
        this.indexReference.set(key, index);
      }

      this.addLineToScene({
        x: lineSegment.x,
        y: lineSegment.y,
        z: 0,
        angle: lineSegment.angle,
        scale: lineSegment.length || 0,
        lineWidth: lineWidth || this.defaultLineWidth,
        colorHex: colorHex || this.defaultColor,
        index,
        mesh,
      });
    });
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

  updateLineOnScene({ startID, endID, colorHex, lineWidth, mesh, z }) {
    if (!mesh) return;

    const way = [startID, endID].join("");
    const reversedWay = [endID, startID].join("");

    const index =
      this.indexReference.get(way) ?? this.indexReference.get(reversedWay);
    const waySegments = this.lineSegments.get(way);
    const reversedWaySegments = this.lineSegments.get(reversedWay);

    const scale = waySegments?.length || reversedWaySegments?.length;
    const angle = waySegments?.angle || reversedWaySegments?.angle;
    const x = waySegments?.x || reversedWaySegments?.x;
    const y = waySegments?.y || reversedWaySegments?.y;

    this.addLineToScene({
      x,
      y,
      z,
      angle,
      scale,
      lineWidth,
      colorHex,
      index,
      mesh,
    });
  }

  addLineToScene({ x, y, z, angle, scale, lineWidth, colorHex, index, mesh }) {
    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    tempObject.position.set(x, y, z);
    tempObject.rotation.set(0, 0, angle ?? 0);
    tempObject.scale.set(scale, lineWidth, 1);
    tempObject.updateMatrix();
    mesh.setMatrixAt(index, tempObject.matrix);
    mesh.setColorAt(index, tempColor.setHex(colorHex).clone());

    mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.material.needsUpdate = true;
  }
}
