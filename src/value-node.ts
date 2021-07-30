import { Frame } from "frame.js";
import { Scope } from "./scope.js";

export interface ValueNode {
  readonly scope: Scope;

  initialize(frame: Frame): void;
}
