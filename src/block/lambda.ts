import { Change } from "./change.js";
import { NodeId } from "./node-id.js";

export interface LambdaChange extends Change {
  nodeChanges: Map<NodeId, Change>;
}

export function lambdaChange(nodeChanges: Map<NodeId, Change>): LambdaChange {
  return {nodeChanges,} as LambdaChange;
}
