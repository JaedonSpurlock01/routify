"use client";

// Move these later
const BLUE = 0xe1faf2;
const RED = 0xfc2d49;
const GREEN = 0x42f587;
const MAP_COLOR = 0x83888c;

// ThreeJS
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

// Third party libraries
import { useEventListener } from "ahooks";

// React
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useMemo, useState, useContext, useEffect, useRef } from "react";

let viewport = new THREE.Vector2();

const CityMap = () => {
  const [dotCount, setDotCount] = useState(0);
  const [bloom, setBloom] = useState(true);

  // State variables to control state of pathfinding
  const { setStartNode, setEndNode, cityGraph, isStopped } =
    useContext(AlgorithmContext);

  // State variables used to control the map
  const {
    glowingLineMeshRef,
    lineMeshRef,
    baseLayerSceneRef,
    topLayerSceneRef,
    parsedLineData,
  } = useContext(ThreeContext);

  // Camera reference used to find cursor position
  const { camera } = useThree();

  // Dot references to directly change their position
  const startDotRef = useRef();
  const endDotRef = useRef();

  // Calculate center of map
  const center = useMemo(
    () => calculateMapCenter(parsedLineData),
    [parsedLineData]
  );

  // "Add" the dot to the scene (moving it from out-of-bounds)
  const addDot = (coordinates) => {
    // Get the closest graph node based on coordinates
    const closestNode = cityGraph.findNearestVertex(
      coordinates.x,
      coordinates.y,
      0
    );

    // If the user is placing a start dot
    if (!dotCount) {
      setStartNode(closestNode);
      startDotRef.current.x = closestNode.x;
      startDotRef.current.y = closestNode.y;
      startDotRef.current.z = 0;
      setDotCount(1);

      // If the user is placing an end dot
    } else if (dotCount === 1) {
      setEndNode(closestNode);
      endDotRef.current.x = closestNode.x;
      endDotRef.current.y = closestNode.y;
      endDotRef.current.z = 0;
      setDotCount(2);
    }
  };

  // Click handling that first finds the position of the cursor,
  // then "adds" the dot to the map (actually it just moves it from far away)
  // Note: mounting and unmounting dots is not recommended by ThreeJS docs
  const handleClick = (event) => {
    if (!event) return;

    viewport.x = (event.clientX / window.innerWidth) * 2 - 1; // Find X NDC coordinate (-1 to 1)
    viewport.y = -((event.clientY / window.innerHeight) * 2) + 1; // Find Y NDC coordinate (-1 to 1)

    let canvasMousePos = worldPointFromScreenPoint(viewport, camera); // Find the position relative to ThreeJS scene

    addDot(canvasMousePos);
  };
  useEventListener("dblclick", handleClick);

  // This event listener controls keyboard events
  useEventListener("keypress", (e) => {
    if (e.key === "c") {
      // Resets the map
      topLayerSceneRef.current.updateScene(
        glowingLineMeshRef,
        cityGraph.edgeToIndex,
        false
      );
      setDotCount(0);
      startDotRef.current.x = 10;
      endDotRef.current.x = 10;
      setStartNode(null);
      setEndNode(null);
    } else if (e.key === "b") {
      // Toggle the bloom
      setBloom(!bloom);
    }
  });

  // This useEffect controls the creation of the map layers
  useEffect(() => {
    if (!baseLayerSceneRef.current) {
      // Initialize the base layer
      baseLayerSceneRef.current = new SceneObject(
        MAP_COLOR,
        0.00005,
        0,
        parsedLineData.length,
        generateSegmentProperties(parsedLineData, center, MAP_COLOR)
      );
    }

    if (!topLayerSceneRef.current) {
      // Initialize the pathfinding layer
      topLayerSceneRef.current = new SceneObject(
        BLUE,
        0.0001,
        0.00001,
        parsedLineData.length,
        generateSegmentProperties(parsedLineData, center, BLUE)
      );
    }

    // Add the lines to each layer
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

  // This useEffect controls the reset of the dots
  useEffect(() => {
    if (isStopped && startDotRef.current && endDotRef.current) {
      setDotCount(0);
      startDotRef.current.x = 10;
      endDotRef.current.x = 10;
      setStartNode(null);
      setEndNode(null);
    }
  }, [isStopped, setStartNode, setEndNode]);

  // The ThreeJS canvas consists of four major assets:
  //  - The base layer: the main map layer
  //  - The pathfinding layer: an invisible copy of the base layer
  //  - The green dot controlled by the user
  //  - The red dot controlled by the user
  return (
    <>
      {/* The fun glow! */}
      {bloom && (
        <EffectComposer>
          <Bloom
            intensity={0.5} // The bloom intensity
            kernelSize={KernelSize.VERY_SMALL} // blur kernel size
            luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene
            luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
            mipmapBlur={true} // Enables or disables mipmap blur
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution
          />
        </EffectComposer>
      )}

      <ambientLight intensity={10} />

      {/* The base map layer */}
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

      {/* The pathfinding map layer */}
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

      {/* Green dot on map */}
      <mesh
        ref={startDotRef}
        position={[
          startDotRef.current ? startDotRef.current.x : 10,
          startDotRef.current ? startDotRef.current.y : 10,
          0,
        ]}
      >
        <sphereGeometry args={[0.0004, 32, 32]} />
        <meshStandardMaterial color={GREEN} />
      </mesh>

      {/* Red dot on map */}
      <mesh
        ref={endDotRef}
        position={[
          endDotRef.current ? endDotRef.current.x : 10,
          endDotRef.current ? endDotRef.current.y : 10,
          0,
        ]}
      >
        <sphereGeometry args={[0.0004, 32, 32]} />
        <meshStandardMaterial color={RED} />
      </mesh>
    </>
  );
};

export default CityMap;
