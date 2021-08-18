import { ArgumentId } from "./argument-id.js";
import { Functor } from "./functor.js";
import { NodeId } from "./node-id.js";

export interface ArgumentNode {
  type: 'argument';
  argumentId: ArgumentId;
}

export interface LambdaNode {
  type: 'lambda';
  // TODO: List out captures to avoid unnecessarily propagating changes to all closure instances.
}

export interface InstanceNode {
  type: 'instance';
  lambdaNodeId: NodeId;
  functor: Functor;
}

export type Node = ArgumentNode | LambdaNode | InstanceNode;
