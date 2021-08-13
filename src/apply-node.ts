import { NodeId } from "./node-id.js";
import { BaseNode } from "./base-node";
import { BlockData } from "./block.js";
import { ArgumentId } from "./argument-id.js";

export interface ApplyNode extends BaseNode {
  type: 'apply';
  lambda: NodeId;
  getArgument(argumentId: ArgumentId): NodeId;
}

// TODO: Do we really need this? Can we just attach the blockdata directly
// when constructing child blocks?
export interface ApplyData {
  block: BlockData;
}
