import { Frame } from "frame.js";
import { ValueNode } from "../value-node.js";
import { Vector } from "../vector.js";

export type VectorElementInsertedObserver = (frame: Frame, index: number) => void;

export type VectorElementDeletedObserver = (frame: Frame, index: number) => void;

export interface VectorNode<T, NT extends ValueNode<T>> extends ValueNode<Vector<T>> {
  readonly elementNode: NT;

  map<U, NU extends ValueNode<U>>(mapper: (element: NT) => NU): VectorNode<U, NU>;

  size(frame: Frame): number;
  element(frame: Frame, index: number): Frame;

  addElementInsertedObserver(observer: VectorElementInsertedObserver): void;
  addElementDeletedObserver(observer: VectorElementDeletedObserver): void;
}
