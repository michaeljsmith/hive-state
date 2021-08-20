import { Block } from "./block/block.js";
import { Node, NodeId } from "./block/index.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export interface Scope {
  parent: Scope | null;
  block: Block;
  captures: Set<NodeId>;
}

let _scope: Scope | null = null;

export function currentScope(): Scope {
  if (_scope === null) {
    throw "no scope";
  }

  return _scope;
}

export function scopeExists(): boolean {
  return _scope !== null;
}

export function inRootScope<T extends Value<ValueType>>(fn: () => T): Block {
  if (_scope !== null) {
    throw "existing scope";
  }

  const {block, captures} = inScope(fn);
  if (captures.size > 0) {
    throw "shouldn't be captures in root scope";
  }
  return block;
}

export function inScope<T extends Value<ValueType>>(fn: () => T): {block: Block, captures: Set<NodeId>} {
  _scope = {
    parent: _scope,
    block: {
      enclosure: _scope?.block ?? null,
      nodes: new Map(),
      nodeOrder: [],
      outputNodeId: "INVALID" as NodeId,
    },
    captures: new Set(),
  }

  try {
    const result = fn();
    _scope.block.outputNodeId = result.internalGetNodeId();
    return {
      block: _scope.block,
      captures: _scope.captures,
    };
  } finally {
    _scope = _scope.parent;
  }
}

export function addNode<T extends ValueType>(nodeId: NodeId, node: Node): Value<T> {
  const scope = currentScope();
  scope.block.nodes.set(nodeId, node);
  scope.block.nodeOrder.push(nodeId);

  return new Value<T>(nodeId);
}

export function referenceNode(nodeId: NodeId): void {
  let scopeIsAncestor = false;
  // Loop through, marking this node as being captured in each scope until
  // we found the scope that defines the value.
  for (let s = _scope; s !== null; s = s.parent) {
    if (s.block.nodes.has(nodeId)) {
      scopeIsAncestor = true;
      break;
    }

    // Record that this scope captures this node.
    s.captures.add(nodeId);
  }

  if (!scopeIsAncestor) {
    throw 'invalid scope';
  }
}