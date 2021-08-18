import { NodeId } from "./node-id.js";
import { Node } from "./node.js";

export interface Block {
  enclosure: Block;
  nodes: Map<NodeId, Node>;
  nodeOrder: NodeId[];
  outputNodeId: NodeId;
}
