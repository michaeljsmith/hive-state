import { NodeId } from "./node-id.js";
import { BaseNode } from "./base-node";
import { Block, BlockData } from "./block.js";
import { ArgumentId } from "./argument-id.js";

export interface ApplyNode extends BaseNode {
  type: 'apply';
  lambda: NodeId;
  block: Block;
  arguments: Map<ArgumentId, NodeId>;
}

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

export function getApplyNodeBlockData(node: ApplyNode, blockData: BlockData): BlockData {
  const applyData = blockData.nodes.get(node.nodeId) as ApplyData | undefined;
  if (applyData === undefined) {
    throw 'Missing node data';
  }
  return applyData.block;  
}
