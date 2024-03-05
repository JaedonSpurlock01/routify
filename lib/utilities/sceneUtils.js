import * as THREE from "three";
import { addLineToMesh } from "./mapUtils";

// Define line geometry for threeJS scene
export const lineBaseSegment = new THREE.Shape();
lineBaseSegment.moveTo(0, 0.5);
lineBaseSegment.lineTo(1, 0.5);
lineBaseSegment.lineTo(1, -0.5);
lineBaseSegment.lineTo(0, -0.5);
lineBaseSegment.lineTo(0, 0.5);

export class SceneObject {
  constructor(lineColor, lineWidth, z_layer, totalLines, segmentProps = []) {
    this.lineColor = lineColor;
    this.lineWidth = lineWidth;
    this.totalLines = totalLines;
    this.segmentProps = segmentProps;
    this.z_layer = z_layer;

    // Temp object for color and position settings (See ThreeJS docs for more info)
    this.objectColor = new THREE.Color();
    this.objectColor.setHex(this.lineColor).clone();

    this.tempObject = new THREE.Object3D();
  }

  setSegmentProps(array) {
    this.segmentProps = array;
  }

  changeColor(hexColor) {
    this.objectColor.setHex(hexColor).clone();
  }

  updateScene(meshRef, lineMap = null, visible, color = null) {
    if (!meshRef.current || !meshRef) return;
    let currentIndex = 0;
    const tempColor = new THREE.Color();

    this.segmentProps.forEach((segment) => {
      addLineToMesh(
        meshRef.current,
        this.tempObject,
        color ? tempColor.setHex(color).clone() : segment.color, // If user wants non-default color
        segment.coords,
        segment.computedData,
        currentIndex,
        visible,
        this.z_layer,
        this.lineWidth
      );

      if (lineMap) {
        const stringCoords = `[${segment.coords[0][0]},${segment.coords[0][1]},${segment.coords[0][2]}],[${segment.coords[1][0]},${segment.coords[1][1]},${segment.coords[1][2]}]`;
        lineMap.set(stringCoords, currentIndex);
      }

      currentIndex++;
    });
  }
}
