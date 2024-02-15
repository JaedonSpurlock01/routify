"use client";

import {
  useLayoutEffect,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";

// threeJS
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { useThree } from "@react-three/fiber";

// Library functions to handle map data
import { SceneObject, lineBaseSegment } from "@/lib/utilities/sceneUtils";
import {
  generateSegmentProperties,
  calculateMapCenter,
  worldPointFromScreenPoint,
} from "@/lib/utilities/mapUtils";
import { Dot } from "./Dot";
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { useEventListener } from "ahooks";
import { ThreeContext } from "@/lib/context/three.context";

let viewport = new THREE.Vector2();

const CityMap = () => {
  const [dots, setDots] = useState([]);
  const {
    setStartNode,
    setEndNode,
    cityGraph,
    setIsAlgorithmReady,
    setIsStarting,
    setIsPaused,
    setIsStopped,
  } = useContext(AlgorithmContext);
  const {
    glowingLineMeshRef,
    lineMeshRef,
    baseLayerSceneRef,
    topLayerSceneRef,
    parsedLineData,
  } = useContext(ThreeContext);
  const { clearAll, setClearAll } = useContext(AlgorithmContext);
  const { camera } = useThree();

  // Calculate center of map
  const center = useMemo(
    () => calculateMapCenter(parsedLineData),
    [parsedLineData]
  );

  // Add either a start dot or a end dot to the scene
  const addDot = (coordinates) => {
    // Get the closest graph node based on coordinates
    const closestNode = cityGraph.findNearestVertex(
      coordinates.x,
      coordinates.y,
      0
    );

    if (!dots.length) {
      // Start node
      setStartNode(closestNode);
      setDots([{ x: closestNode.x, y: closestNode.y, color: 0x42f587 }]);
    } else if (dots.length === 1) {
      // End Node
      setEndNode(closestNode);
      setDots((dots) => [
        ...dots,
        { x: closestNode.x, y: closestNode.y, color: 0xfc2d49 },
      ]);
    }
  };

  const handleClick = (event) => {
    if (!event) return;

    viewport.x = (event.clientX / window.innerWidth) * 2 - 1;
    viewport.y = -((event.clientY / window.innerHeight) * 2) + 1;

    let canvasMousePos = worldPointFromScreenPoint(viewport, camera);

    addDot(canvasMousePos);
  };
  useEventListener("dblclick", handleClick);

  useLayoutEffect(() => {
    // Set up threeJS map layers (base -> gray, top -> pathfinding layer)
    if (!baseLayerSceneRef.current) {
      baseLayerSceneRef.current = new SceneObject(
        0x83888c,
        0.0001,
        0,
        parsedLineData.length,
        generateSegmentProperties(parsedLineData, center, 0x83888c)
      );
    }

    if (!topLayerSceneRef.current) {
      topLayerSceneRef.current = new SceneObject(
        0xe8c497,
        0.0002,
        0.00001,
        parsedLineData.length,
        generateSegmentProperties(parsedLineData, center, 0xe8c497)
      );
    }

    // Add lines to ThreeJS scene
    baseLayerSceneRef.current.updateScene(lineMeshRef, null, true);
    topLayerSceneRef.current.updateScene(
      glowingLineMeshRef,
      cityGraph.edgeToIndex,
      false
    );

    // Fill the graph data structure
    cityGraph.setCenter(center.x, center.y);
    cityGraph.fillGraph(parsedLineData);
  }, [
    baseLayerSceneRef,
    topLayerSceneRef,
    center.x,
    center.y,
    cityGraph,
    glowingLineMeshRef,
    lineMeshRef,
    parsedLineData,
    center,
  ]);

  useEffect(() => {
    if (clearAll) {
      setDots([]);
      setStartNode(null);
      setEndNode(null);
      setClearAll(false);

      topLayerSceneRef.current.updateScene(
        glowingLineMeshRef,
        cityGraph.edgeToIndex,
        false
      );
    }
  }, [
    clearAll,
    setClearAll,
    setStartNode,
    setEndNode,
    setIsAlgorithmReady,
    setIsStarting,
    setIsPaused,
    topLayerSceneRef,
    cityGraph,
    glowingLineMeshRef,
    setIsStopped,
  ]);

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

      <ambientLight intensity={10} />

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
