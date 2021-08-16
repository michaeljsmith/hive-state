import { NodeId } from "./node-id.js";
import { Block, BlockData } from "./block.js";
import { BaseNode } from "./base-node";
import { brandAsChange, Change } from "./change.js";

export interface LambdaNode extends BaseNode {
  type: 'lambda';
  block: Block;
  captures: NodeId[];
}

export interface LambdaChange extends Change {
  nodeChanges: Map<NodeId, Change | undefined>;
}

export function lambdaChange(nodeChanges: Map<NodeId, Change | undefined>): LambdaChange {
  return brandAsChange({ nodeChanges });
}
