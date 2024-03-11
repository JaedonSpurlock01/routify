import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext, useMemo, useState, useRef } from "react";
import PathfindingInstance from "@/lib/models/PathfindingInstance";

import { ColorContext } from "@/lib/context/color.context";
import toast from "react-hot-toast";
import { updateLineColor } from "@/lib/utilities/geoUtils";

let g_line_array = [];

export const AlgorithmController = () => {
  const { cityGraph, isAlgorithmReady, startNode, endNode, isStopped } =
    useContext(AlgorithmContext);
  const { lineMeshRef, topLayerSceneRef } = useContext(ThreeContext);
  const { pathColor, searchColor, mapColor } = useContext(ColorContext);
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
    instance.setStartNode(cityGraph.getVertex(startNode));
    instance.setEndNode(cityGraph.getVertex(endNode));
    instance.setGraph(cityGraph);
    return instance;
  }, [startNode, endNode, cityGraph]);

  // This useEffect clears the new lines when the stop button is pressed
  useEffect(() => {
    if (!isStopped) return;
    toast.success("Map cleared", {
      style: {
        background: "#262626",
        color: "#fff",
      },
      duration: 5000,
    });
    updatedLineIndices.forEach((index) => {
      updateLineColor({
        index: index,
        colorHex: mapColor,
        lineMesh: lineMeshRef.current,
      });
    });

    g_line_array = [];
  }, [isStopped, topLayerSceneRef, lineMeshRef, updatedLineIndices, mapColor]);

  //   // This useEffect controls the "Path" found
  useEffect(() => {
    if (finished && !isStopped) {
      let currentID = endNode;
      const predecessors = pathfindingInstance.getPredecessors();

      if (!predecessors) return;

      if (predecessors.get(currentID)) {
        toast.success("Path found", {
          style: {
            background: "#262626",
            color: "#fff",
          },
          duration: 5000,
        });
      } else {
        toast.error("No path found", {
          style: {
            background: "#262626",
            color: "#fff",
          },
          duration: 5000,
        });
      }

      const delay = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      const processNode = async () => {
        while (
          predecessors &&
          predecessors.get(currentID) &&
          !isStoppedRef.current
        ) {
          let cameFromID = predecessors.get(currentID);

          const way1 = [cameFromID, currentID].join(",");
          const way2 = [currentID, cameFromID].join(",");

          const currentEdgeIndex =
            cityGraph.edgeToIndex.get(way1) ?? cityGraph.edgeToIndex.get(way2);

          if (currentEdgeIndex) {
            updateLineColor({
              index: currentEdgeIndex,
              colorHex: pathColor,
              lineMesh: lineMeshRef.current,
            });
          }

          g_line_array.push(currentEdgeIndex);
          currentID = cameFromID;

          await delay(3);
        }
      };

      processNode();
      setFinished(false);
    }
  }, [
    cityGraph.edgeToIndex,
    endNode,
    finished,
    isStopped,
    lineMeshRef,
    pathColor,
    pathfindingInstance,
  ]);

  // This useEffect controls the pathfinding
  useEffect(() => {
    if (isStopped) {
      setStarted(false);
      setUpdatedLineIndices(g_line_array);
      pathfindingInstance.reset();
      return;
    }

    if (!isAlgorithmReady || started) return;

    if (isAlgorithmReady && !started) {
      pathfindingInstance.start();
      setStarted(true);
    }

    const processSteps = () => {
      for (let i = 0; i < cityGraph.algorithmSpeed; i++) {
        if (pathfindingInstance.finished) {
          setFinished(true);
          return;
        }

        // Process the next step
        const currentEdgeIndex = pathfindingInstance.nextStep();

        if (currentEdgeIndex) {
          updateLineColor({
            index: currentEdgeIndex,
            colorHex: searchColor,
            lineMesh: lineMeshRef.current,
          });

          g_line_array.push(currentEdgeIndex);
        }
      }

      setTimeout(processSteps, 1);
    };

    processSteps(); // Initial call to start processing steps

    setUpdatedLineIndices(g_line_array);
  }, [
    cityGraph,
    isAlgorithmReady,
    isStopped,
    lineMeshRef,
    pathfindingInstance,
    searchColor,
    started,
  ]);

  return null;
};
