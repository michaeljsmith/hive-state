import { Frame } from "frame.js";
import { Scope } from "./scope.js";
import { ValueNode } from "./value-node";

export abstract class BaseValueNode implements ValueNode {
  readonly scope: Scope;

  constructor(scope: Scope) {
    this.scope = scope;
  }

  abstract initialize(frame: Frame): void;
}
