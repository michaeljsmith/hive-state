import { Frame } from "frame.js";
import { Node } from "../node.js";
import { VectorNode } from "./vector-node.js";

export interface MutableVectorNode<T extends Node> extends VectorNode<T> {
  insert(frame: Frame, beforeIndex: number | undefined, initializer: (elementNode: T, frame: Frame) => void): void;
  delete(frame: Frame, index: number): void;
}
