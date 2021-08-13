import { ApplyData, ApplyNode } from "./apply-node.js";
import { NodeId } from "./node-id.js";
import { Node } from "./node.js";

export interface Block {
  encloser: Block;
  caller: ApplyNode;
  getNode(nodeId: NodeId): Node | undefined;
  nodeOrder: NodeId[];
  outputNodeId: NodeId;
}

export interface BlockData {
  encloser: BlockData;
  caller: ApplyData;
  getNode(nodeId: NodeId): {};
}

export function getLocalNode(block: Block, nodeId: NodeId): Node {
  const localNode = block.getNode(nodeId);
  if (localNode === undefined) {
    throw 'Node not found';
  }
  return localNode;
}

export function findNodeById(block: Block, nodeId: NodeId): Node {
  const localNode = block.getNode(nodeId);

  // If the node isn't defined here, check the parent.
  if (localNode === undefined) {
    // TODO: Handle root.
    return findNodeById(block.encloser, nodeId);
  }

  // If this is an argument node, recurse to the caller.
  if (localNode.type === 'argument') {
    const callerNodeId = block.caller.getArgument(localNode.argumentId);
    return findNodeById(block.caller.parent, callerNodeId);
  }

  // Otherwise we have found our node.
  return localNode;
}

export function findNodeParentDataById(block: Block, blockData: BlockData, nodeId: NodeId): BlockData {
  const localNode = block.getNode(nodeId);

  // If the node isn't defined here, check the parent.
  if (localNode === undefined) {
    // TODO: Handle root.
    return findNodeParentDataById(block.encloser, blockData.encloser, nodeId);
  }

  // If this is an argument node, recurse to the caller.
  if (localNode.type === 'argument') {
    const callerNodeId = block.caller.getArgument(localNode.argumentId);
    return findNodeParentDataById(block.caller.parent, blockData.caller.block, callerNodeId);
  }

  // Otherwise we have found our node (or at least its parent, which we are after).
  return blockData;
}
