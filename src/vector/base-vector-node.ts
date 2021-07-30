import { Frame } from "frame.js";
import { Scope } from "scope.js";
import { ValueNode } from "../value-node.js";
import { BaseValueNode } from "../base-value-node";
import { map } from "./map.js";
import { VectorNode, VectorElementInsertedObserver, VectorElementDeletedObserver } from "./vector-node";

export abstract class BaseVectorNode<T extends ValueNode> extends BaseValueNode implements VectorNode<T> {
  private elementInsertedObservers: VectorElementInsertedObserver[] = [];
  private elementDeletedObservers: VectorElementDeletedObserver[] = [];

  elementNode: T;

  constructor(scope: Scope, elementNode: T) {
    super(scope);
    this.elementNode = elementNode;
  }

  abstract size(frame: Frame): number;

  abstract element(frame: Frame, index: number): Frame;

  map<U extends ValueNode>(mapper: (element: T) => U): VectorNode<U> {
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
