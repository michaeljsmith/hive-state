import { Block } from "./block.js";
import { NodeId } from "./node-id.js";

export interface BaseNode {
  parent: Block;
  nodeId: NodeId;
}
