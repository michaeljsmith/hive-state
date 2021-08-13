import { NodeId } from "./node-id.js";
import { Block, BlockData } from "./block.js";
import { BaseNode } from "./base-node";

export interface LambdaNode extends BaseNode {
  type: 'lambda';
  block: Block;
  captures: NodeId[];
}
