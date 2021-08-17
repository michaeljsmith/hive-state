import { NodeContext, NodeContextData } from "./node-context.js";
import { NodeId } from "./node-id.js";
import { Node } from "./node.js";

export interface Block {
  encloser: Block;
  caller: NodeContext;
  nodes: Map<NodeId, Node>;
  nodeOrder: NodeId[];
  outputNodeId: NodeId;
}

export interface BlockData {
  encloser: BlockData;
  caller: NodeContextData;
  nodes: Map<NodeId, {}>;
}

export function getLocalNode(block: Block, nodeId: NodeId): Node {
  const localNode = block.nodes.get(nodeId);
  if (localNode === undefined) {
    throw 'Node not found';
  }
  return localNode;
}
