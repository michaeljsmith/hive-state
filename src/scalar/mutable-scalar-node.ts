import { Frame } from "../frame.js";
import { ScalarNode } from "./scalar-node.js";

export interface MutableScalarNode<T> extends ScalarNode<T> {
  set(frame: Frame, value: T): void;
}
