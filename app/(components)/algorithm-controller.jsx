import { breadthFirstSearch } from "@/lib/algorithms/breadth-first-search";
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext } from "react";

export const AlgorithmController = () => {
  const { currentAlgorithm, isAlgorithmReady, cityGraph } =
    useContext(AlgorithmContext);
  const { glowingLineMeshRef, topLayerSceneRef } = useContext(ThreeContext);

  useEffect(() => {
    if (isAlgorithmReady) {
      breadthFirstSearch(cityGraph, topLayerSceneRef, glowingLineMeshRef);
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
