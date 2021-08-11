import { Instance, InstanceInput } from "./composite.js";

export type BindingId = number & { __brand: "BindingId"; };

let nextBindingId = 101;
export function newBindingId(): BindingId {
  return nextBindingId++ as BindingId;
}

export interface Scope {
  parent: Scope | null;
  instances: Instance[];
  bindings: Map<BindingId, InstanceInput>;
}

let scope: Scope | null;

export function currentScope(): Scope {
  if (scope === null) {
    throw 'no scope defined';
  }

  return scope;
}

export function inNewScope<T>(fn: (scope: Scope) => T): {result: T, scope: Scope} {
  scope = {
    parent: scope,
    instances: [],
    bindings: new Map(),
  };

  try {
    const result = fn(scope);
    return { result, scope };
  } finally {
    if (scope === null) {
      throw "shouldn't get here";
    }
    scope = scope.parent;
  }
}

// TODO: Support bindings in parent scopes.
export function lookupBinding(scope: Scope, bindingId: BindingId): InstanceInput {
  const result = scope.bindings.get(bindingId);
  if (result === undefined) {
    throw 'undefined binding';
  }
  return result;
}
