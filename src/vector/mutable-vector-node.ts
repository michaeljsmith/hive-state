import { Frame } from "frame.js";
import { ValueNode } from "../value-node.js";
import { VectorNode } from "./vector-node.js";

export interface MutableVectorNode<T, NT extends ValueNode<T>> extends VectorNode<T, NT> {
  insert(frame: Frame, beforeIndex: number | undefined, initializer: (elementNode: NT, frame: Frame) => void): void;
  delete(frame: Frame, index: number): void;
}
