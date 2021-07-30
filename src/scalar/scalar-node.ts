import { Frame } from "../frame.js";
import { Node } from "../node.js";

export type ChangedObserver = (frame: Frame) => void;

export interface ScalarNode<T> extends Node {
  get(frame: Frame): T;

  addChangedObserver(observer: ChangedObserver): void;
}
