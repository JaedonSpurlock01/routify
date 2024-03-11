import * as THREE from "three";

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