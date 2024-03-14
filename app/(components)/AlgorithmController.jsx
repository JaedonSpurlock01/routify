import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { ThreeContext } from "@/lib/context/three.context";
import { useEffect, useContext, useMemo, useState, useRef } from "react";
import PathfindingInstance from "@/lib/models/PathfindingInstance";

import { ColorContext } from "@/lib/context/color.context";
import toast from "react-hot-toast";

let g_line_array = [];

export const AlgorithmController = () => {
  const {
    cityGraph,
    isAlgorithmReady,
    startNode,
    endNode,
    isStopped,
    selectedAlgorithm,
  } = useContext(AlgorithmContext);
  const { lineMeshRef, topLayerSceneRef } = useContext(ThreeContext);
  const { pathColor, searchColor, mapColor } = useContext(ColorContext);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [updatedLines, setUpdatedLines] = useState([]);

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
    updatedLines.forEach((line) => {
      topLayerSceneRef.current.updateLineOnScene({
        startID: line[0],
        endID: line[1],
        colorHex: mapColor,
        lineWidth: 0.01,
        mesh: lineMeshRef.current,
      });
    });
    g_line_array = [];
    setUpdatedLines([]);
  }, [isStopped, updatedLines, mapColor, lineMeshRef, topLayerSceneRef]);

  //   // This useEffect controls the "Path" found
  useEffect(() => {
    if (finished && !isStopped && started) {
      let currentID = endNode;
      const predecessors = pathfindingInstance.getPredecessors();

      if (!predecessors) return;

      const existingPath = predecessors.get(currentID);
      const finalDistance = pathfindingInstance.getFinalDistance();

      if (existingPath) {
        toast.success(
          <span>
            <b>Path found!</b>
            <br />
            {finalDistance !== -1 && (
              <>
                Distance:{" "}
                <span className="text-green-500">
                  {(finalDistance / 1000).toFixed(2)}{" "}
                  <span className="text-white">km</span>
                  <span className="text-white"> | </span>
                  {(finalDistance / 1609).toFixed(2)}{" "}
                  <span className="text-white">mi</span>
                </span>
              </>
            )}
          </span>,
          {
            style: {
              background: "#262626",
              color: "#fff",
            },
            duration: 8000,
          }
        );
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

          if (cameFromID) {
            topLayerSceneRef.current.updateLineOnScene({
              startID: cameFromID,
              endID: currentID,
              colorHex: pathColor,
              lineWidth: 0.05,
              mesh: lineMeshRef.current,
              z: 0.008,
            });
          }

          // Add the updated line so it can be reset later
          g_line_array.push([cameFromID, currentID]);

          currentID = cameFromID;
          await delay(3);
        }
      };

      processNode();
      setFinished(false);
    }
  }, [
    endNode,
    finished,
    isStopped,
    lineMeshRef,
    pathColor,
    pathfindingInstance,
    topLayerSceneRef,
    started,
  ]);

  // This useEffect controls the pathfinding
  useEffect(() => {
    if (isStopped) {
      setStarted(false);
      setUpdatedLines(g_line_array);
      pathfindingInstance.reset();
      return;
    }

    if (!isAlgorithmReady || started) return;

    if (isAlgorithmReady && !started) {
      pathfindingInstance.start(selectedAlgorithm);
      setStarted(true);
    }

    const processSteps = () => {
      for (let i = 0; i < cityGraph.algorithmSpeed; i++) {
        if (pathfindingInstance.finished) {
          setFinished(true);
          return;
        }

        // Process the next step
        const ways = pathfindingInstance.nextStep();

        if (ways) {
          for (const way of ways) {
            if (way && way.length == 2) {
              topLayerSceneRef.current.updateLineOnScene({
                startID: way[0],
                endID: way[1],
                colorHex: searchColor,
                lineWidth: 0.025,
                mesh: lineMeshRef.current,
                z: 0.001,
              });

              // Add the updated line so it can be reset later
              g_line_array.push([way[0], way[1]]);
            }
          }
        }
      }

      setTimeout(processSteps, 1);
    };

    processSteps(); // Initial call to start processing steps

    setUpdatedLines(g_line_array);
  }, [
    cityGraph,
    isAlgorithmReady,
    isStopped,
    lineMeshRef,
    pathfindingInstance,
    searchColor,
    started,
    topLayerSceneRef,
    selectedAlgorithm,
  ]);

  return null;
};
