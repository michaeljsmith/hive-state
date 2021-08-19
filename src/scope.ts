import { Block } from "./block/block.js";
import { Node, NodeId } from "./block/index.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export interface Scope {
  parent: Scope | null;
  block: Block;
}

let scope: Scope | null = null;

export function currentScope(): Scope {
  if (scope === null) {
    throw "no scope";
  }

  return scope;
}

export function scopeExists(): boolean {
  return scope !== null;
}

export function inRootScope<T extends Value<ValueType>>(fn: () => T): Block {
  if (scope !== null) {
    throw "existing scope";
  }

  return inScope(fn);
}

export function inScope<T extends Value<ValueType>>(fn: () => T): Block {
  scope = {
    parent: scope,
    block: {
      enclosure: scope?.block ?? null,
      nodes: new Map(),
      nodeOrder: [],
      outputNodeId: "INVALID" as NodeId,
    },
  }

  try {
    const result = fn();
    scope.block.outputNodeId = result.nodeId;
    return scope.block;
  } finally {
    scope = scope.parent;
  }
}

export function addNode<T extends ValueType>(nodeId: NodeId, node: Node): Value<T> {
  const scope = currentScope();
  scope.block.nodes.set(nodeId, node);
  scope.block.nodeOrder.push(nodeId);

  return new Value<T>(scope, nodeId);
}
