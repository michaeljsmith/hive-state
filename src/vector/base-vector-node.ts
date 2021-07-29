import { Frame } from "frame.js";
import { Scope } from "scope.js";
import { ValueNode } from "../value-node.js";
import { BaseValueNode } from "../base-value-node";
import { map } from "./map.js";
import { VectorNode, VectorElementInsertedObserver, VectorElementDeletedObserver } from "./vector-node";

export abstract class BaseVectorNode<T, NT extends ValueNode<T>> extends BaseValueNode<T> implements VectorNode<T, NT> {
  private elementInsertedObservers: VectorElementInsertedObserver[] = [];
  private elementDeletedObservers: VectorElementDeletedObserver[] = [];

  elementNode: NT;

  constructor(scope: Scope, elementNode: NT) {
    super(scope);
    this.elementNode = elementNode;
  }

  abstract size(frame: Frame): number;

  abstract element(frame: Frame, index: number): Frame;

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
