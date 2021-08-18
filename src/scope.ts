import { Node, NodeId } from "./block/index.js";

export interface Scope {
  parent: Scope | null;
  nodes: Map<NodeId, Node>;
  nodeOrder: NodeId[];
}

let scope: Scope | null = null;

export function currentScope(): Scope {
  if (scope === null) {
    throw "no scope";
  }

  return scope;
}
