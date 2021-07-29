import { Scope } from "./scope.js";

export interface ValueNode<T> {
  readonly scope: Scope;
}

export class BaseValueNode<T> implements ValueNode<T> {
  readonly scope: Scope;

  constructor(scope: Scope) {
    this.scope = scope;
  }
}