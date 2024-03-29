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
import { haversineDistance } from "@/lib/utilities/geoUtils";
import { worldPointFromScreenPoint } from "@/lib/utilities/mapUtils";

let viewport = new THREE.Vector2();

const DEFAULT_OFFSET_DOT_POSITION = 100000;

const CityMap = () => {
  const [dotCount, setDotCount] = useState(0);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [isCursorInScene, setIsCursorInScene] = useState(true);
  const [isClickProcessing, setIsClickProcessing] = useState(false);

  // State variables to control state of pathfinding
  const { setStartNode, setEndNode, cityGraph, isStopped, boundingBox } =
    useContext(AlgorithmContext);

  // State variables used to control the map
  const { lineMeshRef, topLayerSceneRef, parsedLineData, setLineCount } =
    useContext(ThreeContext);

  // Color references
  const { startDotColor, endDotColor, mapColor, bloomToggle, setBloomToggle } =
    useContext(ColorContext);
  const [prevColor, setPrevColor] = useState(mapColor);

  // Camera reference used to find cursor position
  const { camera } = useThree();

  // Dot references to directly change their position
  const startDotRef = useRef();
  const endDotRef = useRef();

  if (!topLayerSceneRef.current) {
    topLayerSceneRef.current = new SceneObject(0x83888c, 0.01, boundingBox);

    // Add each node to the graph and scene
    parsedLineData.nodes.forEach((node) => {
      topLayerSceneRef.current.addNode(node);
      cityGraph.addVertex(node.id, node.lat, node.lon);
    });

    topLayerSceneRef.current.calculateMapCenter();

    // Create line properties for each way
    parsedLineData.ways.forEach((way) => {
      for (let i = 0; i < way.length - 1; i++) {
        let startID = way[i];
        let endID = way[i + 1];

        let startNodeCoords = topLayerSceneRef.current.getNode(startID);
        let endNodeCoords = topLayerSceneRef.current.getNode(endID);

        let distance = haversineDistance(
          ...startNodeCoords.unprojected,
          ...endNodeCoords.unprojected
        );

        cityGraph.addEdge(startID, endID, distance * 1000);

        topLayerSceneRef.current.createLineProperty(
          ...startNodeCoords.projected,
          ...endNodeCoords.projected,
          startID,
          endID
        );
      }
    });
    setSceneLoaded(true);
    setLineCount(topLayerSceneRef.current.getLineCount());
  }

  useEffect(() => {
    if (!sceneLoaded || !topLayerSceneRef.current) return;
    topLayerSceneRef.current.updateScene(lineMeshRef);
    return () => {
      // Your entire pc will basically crash if you remove these two lines
      // When hot-reloading or reloading, the line properties get lost, causing
      // Large white squares overlapping each other 1M+ times, causing major
      // z fighting problems
      topLayerSceneRef.current = null;
      setSceneLoaded(false);
    };
  }, [sceneLoaded, topLayerSceneRef, lineMeshRef]);

  // "Add" the dot to the scene (moving it from out-of-bounds)
  const addDot = async (coordinates) => {
    if (isClickProcessing) return;
    setIsClickProcessing(true);

    if (dotCount == 2) {
      setIsClickProcessing(false);
      return;
    }

    // Get the closest graph node based on coordinates
    const closestNode = topLayerSceneRef.current.findNearestNode(
      coordinates.x,
      coordinates.y
    );

    let addressFound;
    await fetch(
      `/api/reverse-geocode?lat=${closestNode.lat}&lon=${closestNode.lon}`,
      {
        method: "GET",
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          addressFound = "";
        }
        const data = await response.json();
        addressFound = data.address;
      })
      .catch((error) => {
        addressFound = "";
      });

    // If the user is placing a start dot
    if (!dotCount) {
      setStartNode(closestNode.id);
      startDotRef.current.x = closestNode.x;
      startDotRef.current.y = closestNode.y;
      startDotRef.current.z = 0;
      setDotCount(1);
      if (addressFound && addressFound.length) {
        toast.success(
          <span>
            <b>Added start at:</b>
            <br />
            {addressFound}
          </span>,
          {
            style: {
              background: "#262626",
              color: "#fff",
            },
          }
        );
      } else {
        toast.success(
          <span>
            <b>Added start</b>
          </span>,
          {
            style: {
              background: "#262626",
              color: "#fff",
            },
          }
        );
      }

      // If the user is placing an end dot
    } else if (dotCount === 1) {
      setEndNode(closestNode.id);
      endDotRef.current.x = closestNode.x;
      endDotRef.current.y = closestNode.y;
      endDotRef.current.z = 0;
      setDotCount(2);
      if (addressFound && addressFound.length) {
        toast.success(
          <span>
            <b>Added goal at:</b>
            <br />
            {addressFound}
          </span>,
          {
            style: {
              background: "#262626",
              color: "#fff",
            },
          }
        );
      } else {
        toast.success(
          <span>
            <b>Added goal</b>
          </span>,
          {
            style: {
              background: "#262626",
              color: "#fff",
            },
          }
        );
      }
    }

    setIsClickProcessing(false);
  };

  // Click handling that first finds the position of the cursor,
  // then "adds" the dot to the map (actually it just moves it from far away)
  // Note: mounting and unmounting dots is not recommended by ThreeJS docs
  const handleClick = (event) => {
    if (!event || !isCursorInScene) return;

    viewport.x = (event.clientX / window.innerWidth) * 2 - 1; // Find X NDC coordinate (-1 to 1)
    viewport.y = -((event.clientY / window.innerHeight) * 2) + 1; // Find Y NDC coordinate (-1 to 1)

    let canvasMousePos = worldPointFromScreenPoint(viewport, camera); // Find the position relative to ThreeJS scene

    addDot(canvasMousePos);
  };
  useEventListener("dblclick", handleClick);

  // Register mouse enter and leave events
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("mouseenter", () => setIsCursorInScene(true));
      canvas.addEventListener("mouseleave", () => setIsCursorInScene(false));
      return () => {
        canvas.removeEventListener("mouseenter", () =>
          setIsCursorInScene(true)
        );
        canvas.removeEventListener("mouseleave", () =>
          setIsCursorInScene(false)
        );
      };
    }
  }, []);

  // This event listener controls keyboard events
  useEventListener("keypress", (e) => {
    if (e.key === "c") {
      // Resets the map
      toast.success("Map Resetted", {
        style: {
          background: "#262626",
          color: "#fff",
        },
        duration: 5000,
      });
      topLayerSceneRef.current.updateScene(lineMeshRef);
      setDotCount(0);
      startDotRef.current.x = DEFAULT_OFFSET_DOT_POSITION;
      endDotRef.current.x = DEFAULT_OFFSET_DOT_POSITION;
      setStartNode(null);
      setEndNode(null);
    } else if (e.key === "b") {
      // Toggle the bloom
      setBloomToggle(!bloomToggle);
    } else if (e.key === "d") {
      toast.success("Cleared points", {
        style: {
          background: "#262626",
          color: "#fff",
        },
        duration: 5000,
      });
      setDotCount(0);
      startDotRef.current.x = DEFAULT_OFFSET_DOT_POSITION;
      endDotRef.current.x = DEFAULT_OFFSET_DOT_POSITION;
      setStartNode(null);
      setEndNode(null);
    }
  });

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
  useEffect(() => {
    if (isStopped && startDotRef.current && endDotRef.current) {
      setDotCount(0);
      startDotRef.current.x = DEFAULT_OFFSET_DOT_POSITION;
      endDotRef.current.x = DEFAULT_OFFSET_DOT_POSITION;
      setStartNode(null);
      setEndNode(null);
    }
  }, [isStopped, setStartNode, setEndNode]);

  // This useEffect controls the color of the map
  useEffect(() => {
    if (prevColor === mapColor) return; // Avoid unnecessary map updates
    topLayerSceneRef.current.changeColor(mapColor);
    topLayerSceneRef.current.updateScene(lineMeshRef);
    setPrevColor(mapColor);
  }, [
    mapColor,
    prevColor,
    lineMeshRef,
    topLayerSceneRef,
    cityGraph.edgeToIndex,
  ]);

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
      <mesh
        ref={startDotRef}
        position={[
          startDotRef.current
            ? startDotRef.current.x
            : DEFAULT_OFFSET_DOT_POSITION,
          startDotRef.current
            ? startDotRef.current.y
            : DEFAULT_OFFSET_DOT_POSITION,
          0,
        ]}
      >
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color={startDotColor} />
      </mesh>

      {/* Red dot on map */}
      <mesh
        ref={endDotRef}
        position={[
          endDotRef.current ? endDotRef.current.x : DEFAULT_OFFSET_DOT_POSITION,
          endDotRef.current ? endDotRef.current.y : DEFAULT_OFFSET_DOT_POSITION,
          0,
        ]}
      >
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color={endDotColor} />
      </mesh>
    </>
  );
};

export default CityMap;
