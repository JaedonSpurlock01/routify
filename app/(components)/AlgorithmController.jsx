import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext, useMemo, useState, useRef } from "react";
import PathfindingInstance from "@/lib/models/PathfindingInstance";
import { addLineToMesh } from "@/lib/utilities/mapUtils";

import * as THREE from "three";

export const AlgorithmController = () => {
  const { cityGraph, isAlgorithmReady, startNode, endNode, isStopped } =
    useContext(AlgorithmContext);
  const { glowingLineMeshRef, topLayerSceneRef } = useContext(ThreeContext);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [updatedLineIndices, setUpdatedLineIndices] = useState([]);

  // Inside your component
  const isStoppedRef = useRef(false);

  useEffect(() => {
    isStoppedRef.current = isStopped; // React is so dumb -_-
  }, [isStopped]);

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
    if (finished) {
      let currentNodeCoords = endNode.createCompositeKey();
      const tempColor = new THREE.Color();
      tempColor.setHex(0xff5454).clone();

      const predecessors = pathfindingInstance.getPredecessors();

      const delay = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      const processNode = async () => {
        while (predecessors.get(currentNodeCoords) && !isStoppedRef.current) {
          let cameFromCoords = predecessors.get(currentNodeCoords);

          const coordinates1 = `[${cameFromCoords}],[${currentNodeCoords}]`;
          const coordinates2 = `[${currentNodeCoords}],[${cameFromCoords}]`;

          const currentEdgeIndex =
            cityGraph.edgeToIndex.get(coordinates1) ??
            cityGraph.edgeToIndex.get(coordinates2);
          const currentEdge =
            topLayerSceneRef.current.segmentProps[currentEdgeIndex];

          if (currentEdge) {
            addLineToMesh(
              glowingLineMeshRef.current,
              topLayerSceneRef.current.tempObject,
              tempColor,
              currentEdge.coords,
              currentEdge.computedData,
              currentEdgeIndex,
              true,
              0.00003,
              0.0007
            );
          }

          currentNodeCoords = cameFromCoords;

          await delay(3);
        }
      };

      processNode();
      setFinished(false);
    }
  }, [
    cityGraph.edgeToIndex,
    endNode,
    glowingLineMeshRef,
    isStopped,
    pathfindingInstance,
    topLayerSceneRef,
    finished,
  ]);

  useEffect(() => {
    if (isStopped) {
      setStarted(false);
      pathfindingInstance.reset();
      return;
    }

    if (!isAlgorithmReady || started) return;

    if (isAlgorithmReady && !started) {
      pathfindingInstance.start();
      setStarted(true);
    }

    const processSteps = () => {
      let updatedLineIndices = [];

      for (let i = 0; i < cityGraph.algorithmSpeed; i++) {
        if (pathfindingInstance.finished) {
          setFinished(true);
          return;
        }

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
    cityGraph.algorithmSpeed,
    endNode,
  ]);

  return null;
};
