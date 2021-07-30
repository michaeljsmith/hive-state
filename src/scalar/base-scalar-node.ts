import { BaseNode } from "base-node.js";
import { Frame } from "frame.js";
import { Scope } from "scope.js";
import { ChangedObserver, ScalarNode } from "./scalar-node.js";

export abstract class BaseScalarNode<T> extends BaseNode implements ScalarNode<T> {
  private changedObservers: ChangedObserver[] = [];

  constructor(scope: Scope) {
    super(scope);
  }

  abstract get(frame: Frame): T;

  addChangedObserver(observer: ChangedObserver): void {
    this.changedObservers.push(observer);
  }

  abstract initialize(frame: Frame): void;
}
