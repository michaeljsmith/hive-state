import { NodeId } from "./node-id.js";
import { Block } from "./block.js";
import { BaseParametricNode } from "./base-parametric-node.js";

export interface ApplyNode extends BaseParametricNode {
  type: 'apply';
  lambda: NodeId;
  block: Block;
}
