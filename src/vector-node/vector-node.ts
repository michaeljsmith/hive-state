import { Frame } from "frame.js";
import { ValueNode } from "../value-node.js";
import { Vector } from "../vector.js";

export type VectorElementInsertedObserver = (frame: Frame, index: number) => void;

export type VectorElementDeletedObserver = (frame: Frame, index: number) => void;

export interface VectorNode<T, NT extends ValueNode<T>> extends ValueNode<Vector<T>> {
  readonly elementNode: NT;

  addElementInsertedObserver(observer: VectorElementInsertedObserver): void;
  addElementDeletedObserver(observer: VectorElementDeletedObserver): void;
}


