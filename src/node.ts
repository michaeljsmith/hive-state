import { Frame } from "frame.js";
import { Scope } from "./scope.js";

export interface Node {
  readonly scope: Scope;

  initialize(frame: Frame): void;
}
