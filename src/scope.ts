import { Node, NodeId } from "./block/index.js";
import { ValueType } from "./value-type.js";
import { brandAsValue, Value } from "./value.js";

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

export function addNode<T extends ValueType>(nodeId: NodeId, node: Node): Value<T> {
  const scope = currentScope();
  scope.nodes.set(nodeId, node);
  scope.nodeOrder.push(nodeId);

  return brandAsValue<T>({
    scope,
    nodeId,
  });
}
