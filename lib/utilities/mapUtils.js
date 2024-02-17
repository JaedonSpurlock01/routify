import * as THREE from "three";

// Add or update a line on a mesh reference
export function addLineToMesh(
  lineMesh,
  tempObject,
  color,
  coords,
  computedData,
  index,
  visible,
  z_index = 0,
  lineWidth = 0.0001
) {
  if (!lineMesh) return;

  const x1 = coords[0][0];
  const y1 = coords[0][1];
  const x2 = coords[1][0];
  const y2 = coords[1][1];

  if (
    computedData.dx === undefined ||
    computedData.y === undefined ||
    computedData.angle === undefined
  ) {
    const startVector = new THREE.Vector3(x1, y1, z_index);
    const endVector = new THREE.Vector3(x2, y2, z_index);
    const length = endVector.distanceTo(startVector);
    const dx = x2 - x1;
    const dy = y2 - y1;

    computedData.dx = dx;
    computedData.dy = dy;
    computedData.length = length;

    const angle = Math.atan2(dy, dx);

    computedData.angle = angle;
  }

  // Note: If there are duplicate points, (start === end) then the scale will be set to 0
  // Due to THREEJS instanced mesh, we cannot simply return if they are equal *cause a big black square will appear*
  const scale = visible ? (computedData.length ? computedData.length : 0) : 0;

  // set line position
  tempObject.position.set(x1, y1, z_index);
  tempObject.rotation.set(0, 0, computedData.angle ?? 0);
  tempObject.scale.set(scale, lineWidth, 1);
  tempObject.updateMatrix();

  lineMesh.setMatrixAt(index, tempObject.matrix);

  lineMesh.setColorAt(index, color);

  lineMesh.instanceColor.needsUpdate = true;
  lineMesh.instanceMatrix.needsUpdate = true;
  lineMesh.material.needsUpdate = true;
}

// Convert NDC coordinates into scene coordinates
export function worldPointFromScreenPoint(screenPoint, camera) {
  let cameraPosition = new THREE.Vector3();
  let mousePosition = new THREE.Vector3();
  cameraPosition.x = screenPoint.x;
  cameraPosition.y = screenPoint.y;
  cameraPosition.z = 0.5;
  cameraPosition.unproject(camera);
  cameraPosition.sub(camera.position).normalize();
  let distance = -camera.position.z / cameraPosition.z;
  mousePosition
    .copy(camera.position)
    .add(cameraPosition.multiplyScalar(distance));
  return mousePosition;
}

// Calculate the center offset to center the map
export const calculateMapCenter = (lineData) => {
  let sumX = 0,
    sumY = 0;
  lineData.forEach(({ start, end }) => {
    sumX += (start[0] + end[0]) / 2;
    sumY += (start[1] + end[1]) / 2;
  });
  return {
    x: sumX / lineData.length,
    y: sumY / lineData.length,
  };
};

// Wraps line data with relevant threeJS qualities
export const generateSegmentProperties = (lineData, center, lineColor) => {
  const segmentLineData = [];
  const tempColor = new THREE.Color();

  lineData.forEach(({ start, end }) => {
    const segmentValue = {
      color: tempColor.setHex(lineColor).clone(),
      computedData: {
        length: undefined,
        dx: undefined,
        dy: undefined,
        angle: undefined,
      },
      coords: [
        [start[0] - center.x, start[1] - center.y, 0],
        [end[0] - center.x, end[1] - center.y, 0],
      ],
    };
    segmentLineData.push(segmentValue);
  });

  return segmentLineData;
};
