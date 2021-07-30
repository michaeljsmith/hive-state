import { BaseNode } from "base-node.js";
import { Frame } from "frame.js";
import { Scope } from "scope.js";
import { MapScalarNode } from "./map-scalar-node.js";
import { ChangedObserver, ScalarNode } from "./scalar-node.js";

export abstract class BaseScalarNode<T> extends BaseNode implements ScalarNode<T> {
  private changedObservers: ChangedObserver[] = [];

  constructor(scope: Scope) {
    super(scope);
  }

  map<U>(mapper: (input: T) => U): ScalarNode<U> {
    return new MapScalarNode<T, U>(this, mapper);
  }
  
  abstract get(frame: Frame): T;

  addChangedObserver(observer: ChangedObserver): void {
    this.changedObservers.push(observer);
  }

  abstract initialize(frame: Frame): void;
}
