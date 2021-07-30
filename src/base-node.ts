import { Frame } from "frame.js";
import { Scope } from "./scope.js";
import { Node } from "./node";

export abstract class ValueNode implements Node {
  readonly scope: Scope;

  constructor(scope: Scope) {
    this.scope = scope;
  }

  abstract initialize(frame: Frame): void;
}
