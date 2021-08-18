import { ArgumentId } from "./argument-id.js";
import { Functor } from "./functor.js";
import { NodeContext } from "./node-context.js";
import { NodeId } from "./node-id.js";

export interface InstanceNode {
  type: 'instance';
  lambdaNodeId?: NodeId;
  functor: Functor;
  arguments: Map<ArgumentId, NodeId>;
}

export interface InstanceData {
  data?: {};
  context: NodeContext;
};
