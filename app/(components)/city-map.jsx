"use client";

import { Graph } from "@/lib/graph";
import { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

// Bloom effect imports
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";

// Temp object for color setting and position settings
const tempColor = new THREE.Color();
const tempObject = new THREE.Object3D();

// Define line width
const lineWidth = 0.0001;

// Pathfinding color
const selectedColor = tempColor.setHex(0xffec3d).clone();

// City Line Color
const lineColor = 0x83888c;

// Define line geometry
const lineBaseSeg = new THREE.Shape();
lineBaseSeg.moveTo(0, 0.5);
lineBaseSeg.lineTo(1, 0.5);
lineBaseSeg.lineTo(1, -0.5);
lineBaseSeg.lineTo(0, -0.5);
lineBaseSeg.lineTo(0, 0.5);

const CityMap = ({ parsedLineData }) => {
  // Define ref to update the triangles and the lines
  const lineMeshRef = useRef();
  const glowingLineMeshRef = useRef();

  const totalLines = parsedLineData.length;

  // Will run only one time since dependency is empty, this prevents unwanted problems with useEffect
  const cityGraph = useMemo(() => new Graph(), []);
  const cityEdgeToIndex = useMemo(() => new Map(), []); // [[x1, y1, z1], [x2, y2, z2]]: index

  // Calculate the center of the map
  const center = useMemo(() => {
    let sumX = 0,
      sumY = 0;
    parsedLineData.forEach(({ start, end }) => {
      sumX += (start[0] + end[0]) / 2;
      sumY += (start[1] + end[1]) / 2;
    });
    return {
      x: sumX / parsedLineData.length,
      y: sumY / parsedLineData.length,
    };
  }, [parsedLineData]);

  // Generate segment properties
  const segmentsProps = useMemo(() => {
    const segmentLineData = new Map();

    parsedLineData.forEach(({ start, end }) => {
      const coords = [
        [start[0] - center.x, start[1] - center.y, 0],
        [end[0] - center.x, end[1] - center.y, 0],
      ];

      const segmentValue = {
        color: tempColor.setHex(lineColor).clone(),
        computedData: {
          length: undefined,
          dx: undefined,
          dy: undefined,
          angle: undefined,
        },
      };

      segmentLineData.set(coords, segmentValue);
    });

    return segmentLineData;
  }, [parsedLineData, center.x, center.y]);

  // Convert city data into graph data structure
  useEffect(() => {
    cityGraph.clearGraph();
    parsedLineData.forEach(({ start, end }) => {
      const vertex1Coords = [start[0] - center.x, start[1] - center.y, 0];
      const vertex2Coords = [end[0] - center.x, end[1] - center.y, 0];

      if (!cityGraph.findIfCoordsAlreadyExist(...vertex1Coords)) {
        cityGraph.addVertex(...vertex1Coords);
      }
      if (!cityGraph.findIfCoordsAlreadyExist(...vertex2Coords)) {
        cityGraph.addVertex(...vertex2Coords);
      }
      cityGraph.addEdgeWithCoords(
        vertex1Coords,
        vertex2Coords,
        cityGraph.calculateDistance(...vertex1Coords, ...vertex2Coords),
        false
      );
    });
    // cityGraph.printAll(); // <- very laggy with bigger cities, can sometimes crash website
  }, [parsedLineData, cityGraph, center.x, center.y]);

  function addLineToMesh(
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

    const scale = visible ? (computedData.length ? computedData.length : 1) : 0;

    // set line position
    tempObject.position.set(x1, y1, z_index);
    tempObject.rotation.set(0, 0, computedData.angle ?? 0);
    tempObject.scale.set(scale, lineWidth, 1);
    tempObject.updateMatrix();

    lineMesh.setMatrixAt(index, tempObject.matrix);
    lineMesh.setColorAt(index, color);
  }

  function makeLineVisible(edgeCoords, lineMeshRef) {
    if (!lineMeshRef.current) return;

    const lineMesh = lineMeshRef.current;
    const segment = segmentsProps.get(edgeCoords);
    const index = cityEdgeToIndex.get(edgeCoords);

    if (segment) {
      addLineToMesh(
        lineMesh,
        tempObject,
        segment.color,
        edgeCoords,
        segment.computedData,
        index,
        true
      );
    }
  }

  function changeLineColorByCoords(edgeCoords, lineMeshRef, color) {
    if (!lineMeshRef.current) return;
    const index = cityEdgeToIndex.get(edgeCoords);
    lineMeshRef.current.setColorAt(index, color);
    lineMeshRef.current.instanceColor.needsUpdate = true; // Lets ThreeJS know the buffer has changed
  }

  function changeLineColorByIndex(index, lineMeshRef, color) {
    if (!lineMeshRef.current) return;
    lineMeshRef.current.setColorAt(index, color);
    lineMeshRef.current.instanceColor.needsUpdate = true; // Lets ThreeJS know the buffer has changed
  }

  useLayoutEffect(() => {
    // Return if the ref is not ready
    if (lineMeshRef === null || lineMeshRef.current === null) return;
    if (glowingLineMeshRef === null || glowingLineMeshRef.current === null)
      return;

    // Simplify syntax for the ref
    const lineMesh = lineMeshRef.current;
    const glowingLineMesh = glowingLineMeshRef.current;

    let currentIndex = 0;

    // Modify every segment in the map of lines
    segmentsProps.forEach((segment, coords) => {
      const color = segment.color;
      const computedData = segment.computedData;

      addLineToMesh(
        lineMesh,
        tempObject,
        color,
        coords,
        computedData,
        currentIndex,
        true,
        0,
        lineWidth
      );
      addLineToMesh(
        glowingLineMesh,
        tempObject,
        color,
        coords,
        computedData,
        currentIndex,
        true,
        0.00001,
        lineWidth,
      );

      cityEdgeToIndex.set(coords, currentIndex);
      currentIndex++;
    });

    // Launch updates
    lineMesh.instanceMatrix.needsUpdate = true;
    lineMesh.instanceColor.needsUpdate = true;
    lineMesh.material.needsUpdate = true;

    glowingLineMesh.instanceMatrix.needsUpdate = true;
    glowingLineMesh.instanceColor.needsUpdate = true;
    glowingLineMesh.material.needsUpdate = true;
  }, [segmentsProps, cityEdgeToIndex]);

  useEffect(() => {
    let timeoutId;
    const color = selectedColor;

    const updateLinesSequentially = (index) => {
      if (index < totalLines) {
        changeLineColorByIndex(index, glowingLineMeshRef, color);
        timeoutId = setTimeout(() => updateLinesSequentially(index + 1), 0);
      }
    };

    updateLinesSequentially(0);

    return () => {
      // Clear the timeout if the component unmounts
      clearTimeout(timeoutId);
    };
  });

  return (
    <>
      <EffectComposer>
        <Bloom
          selection={glowingLineMeshRef}
          intensity={1.0} // The bloom intensity.
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={false} // Enables or disables mipmap blur.
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />
      </EffectComposer>

      <instancedMesh ref={lineMeshRef} args={[null, null, totalLines]}>
        <shapeGeometry args={[lineBaseSeg]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={glowingLineMeshRef} args={[null, null, totalLines]}>
        <shapeGeometry args={[lineBaseSeg]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
};

export default CityMap;
