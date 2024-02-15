import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext, useMemo, useState } from "react";
import PathfindingInstance from "@/lib/models/PathfindingInstance";
import { addLineToMesh } from "@/lib/utilities/mapUtils";

import * as THREE from "three";

export const AlgorithmController = () => {
  const { cityGraph, isAlgorithmReady, startNode, endNode, isStopped } =
    useContext(AlgorithmContext);
  const { glowingLineMeshRef, topLayerSceneRef } = useContext(ThreeContext);
  const [started, setStarted] = useState(false);
  const [updatedLineIndices, setUpdatedLineIndices] = useState([]);

  const pathfindingInstance = useMemo(() => {
    let instance = new PathfindingInstance();
    instance.setStartNode(startNode);
    instance.setEndNode(endNode);
    instance.setGraph(cityGraph);
    return instance;
  }, [startNode, endNode, cityGraph]);

  useEffect(() => {
    if (!isStopped) return;
    updatedLineIndices.forEach((lineIndex) => {
      const line = topLayerSceneRef.current.segmentProps[lineIndex];

      const tempColor = new THREE.Color();

      addLineToMesh(
        glowingLineMeshRef.current,
        topLayerSceneRef.current.tempObject,
        tempColor,
        line.coords,
        line.computedData,
        lineIndex,
        false,
        0.00001,
        topLayerSceneRef.current.lineWidth
      );
    });
  }, [updatedLineIndices, isStopped, glowingLineMeshRef, topLayerSceneRef]);

  useEffect(() => {
    if (isStopped) {
      setStarted(false);
      pathfindingInstance.reset();
      return;
    }

    if (!isAlgorithmReady) return;

    if (isAlgorithmReady && !started) {
      pathfindingInstance.start();
      setStarted(true);
    }

    const processSteps = () => {
      let updatedLineIndices = [];

      for (let i = 0; i < 100; i++) {
        if (pathfindingInstance.finished) return;

        // Process the next step
        const currentEdgeIndex = pathfindingInstance.nextStep();
        const currentEdge =
          topLayerSceneRef.current.segmentProps[currentEdgeIndex];

        if (currentEdge) {
          addLineToMesh(
            glowingLineMeshRef.current,
            topLayerSceneRef.current.tempObject,
            topLayerSceneRef.current.objectColor,
            currentEdge.coords,
            currentEdge.computedData,
            currentEdgeIndex,
            true,
            0.00001,
            topLayerSceneRef.current.lineWidth
          );

          updatedLineIndices.push(currentEdgeIndex);
        }
      }

      setUpdatedLineIndices((prevIndices) => [
        ...prevIndices,
        ...updatedLineIndices,
      ]);
      setTimeout(processSteps, 1);
    };

    processSteps(); // Initial call to start processing steps
  }, [
    isAlgorithmReady,
    pathfindingInstance,
    glowingLineMeshRef,
    topLayerSceneRef,
    isStopped,
    started,
    setUpdatedLineIndices,
    updatedLineIndices,
  ]);

  return null;
};
