import { Scope } from "./scope.js";
import { ValueNode } from "./value-node";

export class BaseValueNode<T> implements ValueNode<T> {
  readonly scope: Scope;

  constructor(scope: Scope) {
    this.scope = scope;
  }
}
