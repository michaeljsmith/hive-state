import { Accessor, brandAsAccessor } from "./accessor.js";
import { BlockData } from "./block.js";
import { Change } from "./change.js";
import { NodeId } from "./node-id.js";

export interface LambdaChange extends Change {
  nodeChanges: Map<NodeId, Change>;
}

export function lambdaChange(nodeChanges: Map<NodeId, Change>): LambdaChange {
  return {nodeChanges,} as LambdaChange;
}

export interface LambdaAccessor extends Accessor {
  getBlockData(): BlockData | null;
}

export function lambdaAccessor(enclosure: BlockData | null): LambdaAccessor {
  return brandAsAccessor<LambdaAccessor>({
    getBlockData() {
      return enclosure;
    }
  });
}