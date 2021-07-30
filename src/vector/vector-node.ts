import { Frame } from "frame.js";
import { ValueNode } from "../value-node.js";

export type VectorElementInsertedObserver = (frame: Frame, index: number) => void;

export type VectorElementDeletedObserver = (frame: Frame, index: number) => void;

export interface VectorNode<T extends ValueNode> extends ValueNode {
  readonly elementNode: T;

  map<U extends ValueNode>(mapper: (element: T) => U): VectorNode<U>;

  size(frame: Frame): number;
  element(frame: Frame, index: number): Frame;

  addElementInsertedObserver(observer: VectorElementInsertedObserver): void;
  addElementDeletedObserver(observer: VectorElementDeletedObserver): void;
}
