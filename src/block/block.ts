import { NodeContext } from "./node-context.js";
import { NodeId } from "./node-id.js";
import { Node } from "./node.js";

export interface Block {
  enclosure: Block | null;
  nodes: Map<NodeId, Node>;
  nodeOrder: NodeId[];
  outputNodeId: NodeId;
}

export interface BlockData {
  enclosure: BlockData | null;
  context: NodeContext;
  // TODO: Flatten this into the parent class, trying to make the whole thing
  // work with hidden classes.
  nodes: Map<NodeId, {}>;
}

export function getNode(block: Block, nodeId: NodeId): Node {
  const localNode = block.nodes.get(nodeId);
  if (localNode === undefined) {
    throw 'Node not found';
  }
  return localNode;
}

export function getNodeData(blockData: BlockData, nodeId: NodeId): {} {
  const applyData = blockData.nodes.get(nodeId);
  if (applyData === undefined) {
    throw 'Missing node data';
  }
  return applyData;
}

export function getEnclosure(block: Block): Block {
  if (block.enclosure === null) {
    throw 'unknown node';
  }
  return block.enclosure;
}

export function getEnclosureData(blockData: BlockData): BlockData {
  if (blockData.enclosure === null) {
    throw 'unknown node';
  }
  return blockData.enclosure;
}
