import { Frame, newFrameKey } from "frame.js";
import { Scope } from "scope.js";
import { BaseValueNode, ValueNode } from "../value-node.js";
import { Vector } from "../vector.js";
import { map } from "./map.js";

type VectorElementInsertedObserver = (frame: Frame, index: number) => void;

type VectorElementDeletedObserver = (frame: Frame, index: number) => void;

export interface VectorNode<T, NT extends ValueNode<T>> extends ValueNode<Vector<T>> {
  readonly elementNode: NT;

  addElementInsertedObserver(observer: VectorElementInsertedObserver): void;
  addElementDeletedObserver(observer: VectorElementDeletedObserver): void;
}

export class BaseVectorNode<T, NT extends ValueNode<T>> extends BaseValueNode<T> implements VectorNode<T, NT> {
  private elementInsertedObservers: VectorElementInsertedObserver[] = [];
  private elementDeletedObservers: VectorElementDeletedObserver[] = [];

  elementNode: NT;

  constructor(scope: Scope, elementNode: NT) {
    super(scope);
    this.elementNode = elementNode;
  }

  map<U, NU extends ValueNode<U>>(mapper: (element: NT) => NU): VectorNode<U, NU> {
    return map(this, mapper);
  }

  addElementInsertedObserver(observer: VectorElementInsertedObserver): void {
    this.elementInsertedObservers.push(observer);
  }

  broadcastElementInsertedEvent(...args: [frame: Frame, index: number]): void {
    this.elementInsertedObservers.forEach((observer) => observer(...args));
  }

  addElementDeletedObserver(observer: VectorElementDeletedObserver): void {
    this.elementDeletedObservers.push(observer);
  }

  broadcastElementDeletedEvent(...args: [frame: Frame, index: number]): void {
    this.elementDeletedObservers.forEach((observer) => observer(...args));
  }
}
