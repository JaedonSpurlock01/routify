"use client";

// ThreeJS
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { useThree } from "@react-three/fiber";

// Library functions to handle map data
import { SceneObject, lineBaseSegment } from "@/lib/models/SceneObject";
// Third party libraries
import { useEventListener } from "ahooks";

// React
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useState, useContext, useEffect, useRef } from "react";
import { ColorContext } from "@/lib/context/color.context";
import toast from "react-hot-toast";

let viewport = new THREE.Vector2();

const CityMap = () => {
  const [dotCount, setDotCount] = useState(0);
  const [sceneLoaded, setSceneLoaded] = useState(false);

  // State variables to control state of pathfinding
  const { setStartNode, setEndNode, cityGraph, isStopped, boundingBox } =
    useContext(AlgorithmContext);

  // State variables used to control the map
  const { lineMeshRef, topLayerSceneRef, parsedLineData } =
    useContext(ThreeContext);

  // Color references
  const {
    startDotColor,
    endDotColor,
    mapColor,
    searchColor,
    bloomToggle,
    setBloomToggle,
  } = useContext(ColorContext);
  const [prevColor, setPrevColor] = useState(mapColor);

  // Camera reference used to find cursor position
  const { camera } = useThree();

  // Dot references to directly change their position
  const startDotRef = useRef();
  const endDotRef = useRef();

  if (!topLayerSceneRef.current) {
    topLayerSceneRef.current = new SceneObject(0x83888c, 0.00004, boundingBox);
    const center = topLayerSceneRef.current.calculateMapCenter();

    // Add each node to the graph and scene
    parsedLineData.nodes.forEach((node) => {
      topLayerSceneRef.current.addNode(node);
      // Add to graph here as well
    });
    // Create line properties for each way
    parsedLineData.ways.forEach((way) => {
      for (let i = 0; i < way.length - 1; i++) {
        let startID = way[i];
        let endID = way[i + 1];

        let startNodeCoords = topLayerSceneRef.current.getNode(startID);
        let endNodeCoords = topLayerSceneRef.current.getNode(endID);

        topLayerSceneRef.current.createLineProperty(
          ...startNodeCoords,
          ...endNodeCoords,
          startID,
          endID
        );
      }
    });
    setSceneLoaded(true);
  }

  useEffect(() => {
    if (!sceneLoaded) return;
    topLayerSceneRef.current.updateScene(lineMeshRef);
  }, [sceneLoaded, topLayerSceneRef, lineMeshRef]);

  // "Add" the dot to the scene (moving it from out-of-bounds)
  // const addDot = (coordinates) => {
  //   // Get the closest graph node based on coordinates
  //   const closestNode = cityGraph.findNearestVertex(
  //     coordinates.x,
  //     coordinates.y,
  //     0
  //   );

  //   // If the user is placing a start dot
  //   if (!dotCount) {
  //     setStartNode(closestNode);
  //     startDotRef.current.x = closestNode.x;
  //     startDotRef.current.y = closestNode.y;
  //     startDotRef.current.z = 0;
  //     setDotCount(1);
  //     toast.success("Added start at:\n9534 Cypress St.Garland, TX 75043", {
  //       style: {
  //         background: "#262626",
  //         color: "#fff",
  //       },
  //     });

  //     // If the user is placing an end dot
  //   } else if (dotCount === 1) {
  //     setEndNode(closestNode);
  //     endDotRef.current.x = closestNode.x;
  //     endDotRef.current.y = closestNode.y;
  //     endDotRef.current.z = 0;
  //     setDotCount(2);
  //     toast.success(
  //       "Added goal at:\n649 W. El Dorado Street Suitland, MD 20746",
  //       {
  //         style: {
  //           background: "#262626",
  //           color: "#fff",
  //         },
  //       }
  //     );
  //   }
  // };

  // Click handling that first finds the position of the cursor,
  // then "adds" the dot to the map (actually it just moves it from far away)
  // Note: mounting and unmounting dots is not recommended by ThreeJS docs
  // const handleClick = (event) => {
  //   if (!event) return;

  //   viewport.x = (event.clientX / window.innerWidth) * 2 - 1; // Find X NDC coordinate (-1 to 1)
  //   viewport.y = -((event.clientY / window.innerHeight) * 2) + 1; // Find Y NDC coordinate (-1 to 1)

  //   let canvasMousePos = worldPointFromScreenPoint(viewport, camera); // Find the position relative to ThreeJS scene

  //   addDot(canvasMousePos);
  // };
  // useEventListener("dblclick", handleClick);

  // This event listener controls keyboard events
  // useEventListener("keypress", (e) => {
  //   if (e.key === "c") {
  //     // Resets the map
  //     toast.success("Map Cleared", {
  //       style: {
  //         background: "#262626",
  //         color: "#fff",
  //       },
  //       duration: 5000,
  //     });
  //     topLayerSceneRef.current.updateScene(
  //       glowingLineMeshRef,
  //       cityGraph.edgeToIndex,
  //       false
  //     );
  //     setDotCount(0);
  //     startDotRef.current.x = 10;
  //     endDotRef.current.x = 10;
  //     setStartNode(null);
  //     setEndNode(null);
  //   } else if (e.key === "b") {
  //     // Toggle the bloom
  //     setBloomToggle(!bloomToggle);
  //   }
  // });

  // This useEffect controls the complete refresh of the page when reloading (Fixes memory leak issues *Stupid react*)
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.location.reload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // This useEffect controls the reset of the dots
  // useEffect(() => {
  //   if (isStopped && startDotRef.current && endDotRef.current) {
  //     setDotCount(0);
  //     startDotRef.current.x = 10;
  //     endDotRef.current.x = 10;
  //     setStartNode(null);
  //     setEndNode(null);
  //   }
  // }, [isStopped, setStartNode, setEndNode]);

  // This useEffect controls the color of map
  // useEffect(() => {
  //   if (prevColor === mapColor) return; // Avoid unnecessary map updates
  //   baseLayerSceneRef.current.updateScene(lineMeshRef, null, true, mapColor);
  //   setPrevColor(mapColor);
  // }, [mapColor]);

  // This useEffect controls the color of the search
  // useEffect(() => {
  //   if (prevColor === searchColor) return; // Avoid unnecessary map updates
  //   topLayerSceneRef.current.changeColor(searchColor);
  //   setPrevColor(searchColor);
  // }, [searchColor]);

  // The ThreeJS canvas consists of four major assets:
  //  - The base layer: the main map layer
  //  - The pathfinding layer: an invisible copy of the base layer
  //  - The green dot controlled by the user
  //  - The red dot controlled by the user
  return (
    <>
      {/* The fun glow! */}
      {bloomToggle && (
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

      {/* The map layer */}
      <instancedMesh
        ref={lineMeshRef}
        args={[null, null, topLayerSceneRef.current.getLineCount()]}
      >
        <shapeGeometry args={[lineBaseSegment]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Green dot on map */}
      {/* <mesh
        ref={startDotRef}
        position={[
          startDotRef.current ? startDotRef.current.x : 10,
          startDotRef.current ? startDotRef.current.y : 10,
          0,
        ]}
      >
        <sphereGeometry args={[0.0004, 32, 32]} />
        <meshStandardMaterial color={startDotColor} />
      </mesh> */}
      {/* Red dot on map */}
      {/* <mesh
        ref={endDotRef}
        position={[
          endDotRef.current ? endDotRef.current.x : 10,
          endDotRef.current ? endDotRef.current.y : 10,
          0,
        ]}
      >
        <sphereGeometry args={[0.0004, 32, 32]} />
        <meshStandardMaterial color={endDotColor} />
      </mesh> */}
    </>
  );
};

export default CityMap;
