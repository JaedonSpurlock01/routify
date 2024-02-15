import PathfindingAlgorithm from "./algorithms/pathfindingAlgorithm";
import AStar from "./algorithms/AStar";

export default class PathfindingInstance {
    static #instance;

    constructor() {
        if (!PathfindingState.#instance) {
            this.endNode = null;
            this.graph = null;
            this.finished = false;
            this.algorithm = new PathfindingAlgorithm();
            PathfindingState.#instance = this;
        }
    
        return PathfindingState.#instance;
    }


    reset() {
        this.finished = false;
        if(!this.graph) return;
    }

    start(algorithm) {
        this.reset();
        switch(algorithm) {
            case "astar":
                this.algorithm = new AStar();
                break;
            default:
                this.algorithm = new AStar();
                break;
        }

        this.algorithm.start(this.startNode, this.endNode);
    }

    nextStep() {
        const updatedNodes = this.algorithm.nextStep();
        if(this.algorithm.finished || updatedNodes.length === 0) {
            this.finished = true;
        }

        return updatedNodes;
    }
}