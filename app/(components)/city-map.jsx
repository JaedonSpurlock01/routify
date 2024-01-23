"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";

// threeJS
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { useThree } from "@react-three/fiber";

// Library functions to handle map data
import { SceneObject, lineBaseSegment } from "@/lib/utilities/sceneUtils";
import { breadthFirstSearch } from "@/lib/algorithms/breadth-first-search";
import { depthFirstSearch } from "@/lib/algorithms/depth-first-search";
import { Graph } from "@/lib/graph";
import {
  generateSegmentProperties,
  calculateMapCenter,
} from "@/lib/utilities/mapUtils";
import { Dot } from "./dot";

var viewport = new THREE.Vector2();

const CityMap = ({ parsedLineData, pointEventData }) => {
  // Define ref to update the lines
  const lineMeshRef = useRef();
  const glowingLineMeshRef = useRef();
  const cityGraph = useMemo(() => new Graph(), []);
  const [dots, setDots] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  const { camera } = useThree();

  function worldPointFromScreenPoint(screenPoint, camera) {
    let worldPoint = new THREE.Vector3();
    worldPoint.x = screenPoint.x;
    worldPoint.y = screenPoint.y;
    worldPoint.z = 0;
    worldPoint.unproject(camera);
    return worldPoint;
  }

  // Add either a start dot or a end dot to the scene
  const addDot = useCallback(
    (coordinates) => {
      console.log(coordinates);

      // Get the closest graph node based on coordinates
      const closestNode = cityGraph.findNearestVertex(
        coordinates.x,
        coordinates.y,
        0
      );

      console.log(closestNode.x, closestNode.y, closestNode.z);

      return;

      if (!dots.length) {
        // Start node
        console.log("Adding start dot!");
        setStartNode(closestNode);
        setDots([{ x, y, color: "green" }]);
      } else if (dots.length === 1) {
        // End Node
        console.log("Adding end dot!");
        setEndNode(closestNode);
        setDots([...dots, { x, y, color: "red" }]);
      }
    },
    [cityGraph, dots]
  );

  useEffect(() => {
    if (!pointEventData) return;

    viewport.x = (pointEventData.clientX / window.innerWidth) * 2 - 1;
    viewport.y = -((pointEventData.clientY / window.innerHeight) * 2) + 1;

    let canvasMousePos = worldPointFromScreenPoint(viewport, camera);

    addDot(canvasMousePos);
  }, [pointEventData, addDot, camera]);

  // Calculate the center of the map
  const center = useMemo(
    () => calculateMapCenter(parsedLineData),
    [parsedLineData]
  );

  const baseLayerScene = useMemo(
    () =>
      new SceneObject(
        0x83888c,
        0.0001,
        0,
        parsedLineData.length,
        generateSegmentProperties(parsedLineData, center, 0x83888c)
      ),
    [parsedLineData, center]
  );

  const topLayerScene = useMemo(
    () =>
      new SceneObject(
        0x2effc0,
        0.0002,
        0.00001,
        parsedLineData.length,
        generateSegmentProperties(parsedLineData, center, 0x2effc0)
      ),
    [parsedLineData, center]
  );

  // Convert city data into graph data structure
  useEffect(() => {
    cityGraph.setCenter(center.x, center.y);
    cityGraph.fillGraph(parsedLineData);
  }, [parsedLineData, cityGraph, center.x, center.y]);

  // Add lines to the threeJS scene
  useLayoutEffect(() => {
    baseLayerScene.updateScene(lineMeshRef, null, true);
    topLayerScene.updateScene(glowingLineMeshRef, cityGraph.edgeToIndex, false);
  }, [cityGraph, baseLayerScene, topLayerScene]);

  // Temporary function to test visual BFS, will be removed later
  useEffect(() => {
    depthFirstSearch(cityGraph, topLayerScene, glowingLineMeshRef);
  }, [cityGraph, topLayerScene]);

  return (
    <>
      <EffectComposer>
        <Bloom
          selection={glowingLineMeshRef}
          intensity={1.5} // The bloom intensity.
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={false} // Enables or disables mipmap blur.
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />
      </EffectComposer>

      <instancedMesh
        ref={lineMeshRef}
        args={[null, null, parsedLineData.length]}
      >
        <shapeGeometry args={[lineBaseSegment]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh
        ref={glowingLineMeshRef}
        args={[null, null, parsedLineData.length]}
      >
        <shapeGeometry args={[lineBaseSegment]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>

      {dots.map((dot, index) => (
        <Dot key={index} position={[dot.x, dot.y, 0]} color={dot.color} />
      ))}
    </>
  );
};

export default CityMap;
