import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext, useMemo, useRef, useState } from "react";
import PathfindingInstance from "@/lib/models/PathfindingInstance";
import { addLineToMesh } from "@/lib/utilities/mapUtils";

export const AlgorithmController = () => {
  const { cityGraph, isAlgorithmReady, startNode, endNode, isStopped } =
    useContext(AlgorithmContext);
  const { glowingLineMeshRef, topLayerSceneRef } = useContext(ThreeContext);
  const [started, setStarted] = useState(false);

  const pathfindingInstance = useMemo(() => {
    let instance = new PathfindingInstance();
    instance.setStartNode(startNode);
    instance.setEndNode(endNode);
    instance.setGraph(cityGraph);
    return instance;
  }, [startNode, endNode, cityGraph]);

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
      for (let i = 0; i < 200; i++) {
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
        }
      }

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
  ]);

  return null;
};
