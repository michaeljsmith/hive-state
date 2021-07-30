import { Frame } from "frame.js";
import { Scope } from "./scope.js";

export interface ValueNode<T> {
  readonly scope: Scope;

  initialize(frame: Frame): void;
}
