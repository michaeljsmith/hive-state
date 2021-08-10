import { Instance } from "./composite.js";

export interface Scope {
  parent: Scope | null;
  instances: Instance[];
}

let scope: Scope | null;

export function currentScope(): Scope {
  if (scope === null) {
    throw 'no scope defined';
  }

  return scope;
}

export function inNewScope<T>(fn: (scope: Scope) => T): {result: T, instances: Instance[]} {
  scope = {
    parent: scope,
    instances: [],
  };

  try {
    const result = fn(scope);
    return { result, instances: scope.instances };
  } finally {
    if (scope === null) {
      throw "shouldn't get here";
    }
    scope = scope.parent;
  }
}
