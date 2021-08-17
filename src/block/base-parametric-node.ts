import { ArgumentId } from "./argument-id.js";
import { BaseNode } from "./base-node.js";
import { BlockData } from "./block.js";
import { NodeId } from "./node-id.js";

export interface BaseParametricNode extends BaseNode {
  arguments: Map<ArgumentId, NodeId>;
}

export interface BaseParametricData {
  parent: BlockData;
}

export function getParametricNodeArgument(node: BaseParametricNode, argumentId: ArgumentId): NodeId {
  const nodeId = node.arguments.get(argumentId);
  if (nodeId === undefined) {
    throw 'Invalid argument';
  }
  return nodeId;
}
