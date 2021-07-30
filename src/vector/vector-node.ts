import { Frame } from "frame.js";
import { Node } from "../node.js";

export type VectorElementInsertedObserver = (frame: Frame, index: number) => void;

export type VectorElementDeletedObserver = (frame: Frame, index: number) => void;

export interface VectorNode<T extends Node> extends Node {
  readonly elementNode: T;

  map<U extends Node>(mapper: (element: T) => U): VectorNode<U>;

  size(frame: Frame): number;
  element(frame: Frame, index: number): Frame;

  addElementInsertedObserver(observer: VectorElementInsertedObserver): void;
  addElementDeletedObserver(observer: VectorElementDeletedObserver): void;
}
