import { NodeId } from "./node-id.js";
import { BaseNode } from "./base-node";
import { BlockData } from "./block.js";
import { ArgumentId } from "./argument-id.js";

export interface ApplyNode extends BaseNode {
  type: 'apply';
  lambda: NodeId;
  arguments: Map<ArgumentId, NodeId>;
}

// TODO: Do we really need this? Can we just attach the blockdata directly
// when constructing child blocks?
export interface ApplyData {
  parent: BlockData;
  block: BlockData;
}

export function getApplyNodeArgument(node: ApplyNode, argumentId: ArgumentId): NodeId {
  const nodeId = node.arguments.get(argumentId);
  if (nodeId === undefined) {
    throw 'Invalid argument';
  }
  return nodeId;
}
