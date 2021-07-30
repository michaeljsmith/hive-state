import { Frame } from "frame.js";
import { ValueNode } from "../value-node.js";
import { VectorNode } from "./vector-node.js";

export interface MutableVectorNode<T extends ValueNode> extends VectorNode<T> {
  insert(frame: Frame, beforeIndex: number | undefined, initializer: (elementNode: T, frame: Frame) => void): void;
  delete(frame: Frame, index: number): void;
}
