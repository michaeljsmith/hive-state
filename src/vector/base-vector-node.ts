import { Frame } from "frame.js";
import { Scope } from "scope.js";
import { Node } from "../node.js";
import { BaseNode } from "../base-node";
import { VectorNode, VectorElementInsertedObserver, VectorElementDeletedObserver } from "./vector-node";
import { MapVectorNode } from "./map-vector-node.js";

export abstract class BaseVectorNode<T extends Node> extends BaseNode implements VectorNode<T> {
  private elementInsertedObservers: VectorElementInsertedObserver[] = [];
  private elementDeletedObservers: VectorElementDeletedObserver[] = [];

  elementNode: T;

  constructor(scope: Scope, elementNode: T) {
    super(scope);
    this.elementNode = elementNode;
  }

  abstract size(frame: Frame): number;

  abstract element(frame: Frame, index: number): Frame;

  map<U extends Node>(mapper: (element: T) => U): VectorNode<U> {
    return new MapVectorNode<T, U>(this, mapper);
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
