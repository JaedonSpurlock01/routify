"use client";

import {
  useLayoutEffect,
  useMemo,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

// threeJS
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { useFrame, useThree } from "@react-three/fiber";

// Library functions to handle map data
import { SceneObject, lineBaseSegment } from "@/lib/utilities/sceneUtils";
import {
  generateSegmentProperties,
  calculateMapCenter,
  worldPointFromScreenPoint,
} from "@/lib/utilities/mapUtils";
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { useEventListener } from "ahooks";
import { ThreeContext } from "@/lib/context/three.context";

let viewport = new THREE.Vector2();

const CityMap = () => {
  const [dotCount, setDotCount] = useState(0);
  const { setStartNode, setEndNode, cityGraph } = useContext(AlgorithmContext);
  const {
    glowingLineMeshRef,
    lineMeshRef,
    baseLayerSceneRef,
    topLayerSceneRef,
    parsedLineData,
  } = useContext(ThreeContext);
  const { isStopped } = useContext(AlgorithmContext);
  const { camera } = useThree();

  const startDotRef = useRef();
  const endDotRef = useRef();

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

    console.log(startDotRef, endDotRef);

    if (!dotCount) {
      setStartNode(closestNode);
      startDotRef.current.set(closestNode.x, closestNode.y, 0);
      setDotCount(1);
    } else if (dotCount === 1) {
      setEndNode(closestNode);
      endDotRef.current.set(closestNode.x, closestNode.y, 0);
      setDotCount(2);
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

  useEventListener("keypress", (e) => {
    if (e.key === "c") {
      topLayerSceneRef.current.updateScene(
        glowingLineMeshRef,
        cityGraph.edgeToIndex,
        false
      );
      setDotCount(0);
      startDotRef.current.set(10, 10, 0);
      endDotRef.current.set(10, 10, 0);
      setStartNode(null);
      setEndNode(null);
    }
  });

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
        0xd1fff1,
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
    if (isStopped) {
      setDotCount(0);
      startDotRef.current.set(10, 10, 0);
      endDotRef.current.set(10, 10, 0);
      setStartNode(null);
      setEndNode(null);
    }
  }, [isStopped, setStartNode, setEndNode]);

  return (
    <>
      <EffectComposer>
        <Bloom
          selection={glowingLineMeshRef}
          intensity={0.5} // The bloom intensity.
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

      <mesh
        ref={startDotRef}
        position={[startDotRef.current.x, startDotRef.current.y, 0]}
      >
        <sphereGeometry args={[0.0004, 32, 32]} />
        <meshStandardMaterial color={0x42f587} />
      </mesh>

      <mesh
        ref={endDotRef}
        position={[endDotRef.current.x, endDotRef.current.y, 0]}
      >
        <sphereGeometry args={[0.0004, 32, 32]} />
        <meshStandardMaterial color={0xfc2d49} />
      </mesh>
    </>
  );
};

export default CityMap;
