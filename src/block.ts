import { ApplyData, ApplyNode, getApplyNodeArgument } from "./apply-node.js";
import { NodeId } from "./node-id.js";
import { Node } from "./node.js";

export interface Block {
  encloser: Block;
  caller: ApplyNode;
  nodes: Map<NodeId, Node>;
  nodeOrder: NodeId[];
  outputNodeId: NodeId;
}

export interface BlockData {
  encloser: BlockData;
  caller: ApplyData;
  nodes: Map<NodeId, {}>;
}

export function getLocalNode(block: Block, nodeId: NodeId): Node {
  const localNode = block.nodes.get(nodeId);
  if (localNode === undefined) {
    throw 'Node not found';
  }
  return localNode;
}

export function visitNode<R>(
    block: Block,
    blockData: BlockData | undefined,
    nodeId: NodeId,
    visitor: (node: Node, nodeData: {} | undefined, blockData: BlockData | undefined) => R)
: R {
  const localNode = block.nodes.get(nodeId);

  // If the node isn't defined here, check the parent.
  if (localNode === undefined) {
    // TODO: Handle root.
    return visitNode(block.encloser, blockData?.encloser, nodeId, visitor);
  }

  // If this is an argument node, recurse to the caller.
  if (localNode.type === 'argument') {
    const callerNodeId = getApplyNodeArgument(block.caller, localNode.argumentId);
    return visitNode(block.caller.parent, blockData?.caller?.parent, callerNodeId, visitor);
  }

  // Otherwise, we have found our node.
  return visitor(localNode, blockData?.nodes?.get(nodeId), blockData);
}

export function visitNodeWithData<R>(
    block: Block,
    blockData: BlockData,
    nodeId: NodeId,
    visitor: (node: Node, nodeData: {} | undefined, blockData: BlockData) => R)
: R {
  return visitNode(block, blockData, nodeId, (node, nodeData, blockData) => {
    if (blockData === undefined) {
      throw 'missing blockData';
    }
    return visitor(node, nodeData, blockData);
  });
}

export function findNodeById(block: Block, nodeId: NodeId): Node {
  return visitNode(block, undefined, nodeId, (node) => node);
}

export function findNodeParentDataById(block: Block, blockData: BlockData, nodeId: NodeId): BlockData {
  return visitNodeWithData(block, blockData, nodeId, (_node, _nodeData, blockData) => blockData);
}
