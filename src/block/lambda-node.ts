import { NodeId } from "./node-id.js";

export interface LambdaNode {
  type: 'lambda';
  captures: Set<NodeId>;
}
