import { breadthFirstSearch } from "@/lib/models/algorithms/breadth-first-search";
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext } from "react";

export const AlgorithmController = () => {
  const { currentAlgorithm, isAlgorithmReady, cityGraph, startNode, endNode } =
    useContext(AlgorithmContext);
  const { glowingLineMeshRef, topLayerSceneRef } = useContext(ThreeContext);

  useEffect(() => {
    if (isAlgorithmReady) {
      breadthFirstSearch(
        cityGraph,
        topLayerSceneRef,
        glowingLineMeshRef,
        startNode,
        endNode
      );
    }
  }, [
    currentAlgorithm,
    isAlgorithmReady,
    cityGraph,
    glowingLineMeshRef,
    topLayerSceneRef,
  ]);

  return null;
};
