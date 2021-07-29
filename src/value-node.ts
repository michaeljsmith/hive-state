import { Scope } from "./scope.js";

export interface ValueNode<T> {
  readonly scope: Scope;
}
