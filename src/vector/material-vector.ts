import { Frame, newFrameKey } from "frame.js";
import { Scope } from "scope.js";
import { ValueNode } from "../value-node.js";
import { BaseVectorNode } from "./base-vector-node.js";
import { MutableVectorNode } from "./mutable-vector-node.js"

export function materialVector<T, NT extends ValueNode<T>>(scope: Scope, elementNode: NT): MutableVectorNode<T, NT> {
  return new MaterialVectorNode<T, NT>(scope, elementNode);
}

class MaterialVectorNode<T, NT extends ValueNode<T>> extends BaseVectorNode<T, NT> implements MutableVectorNode<T, NT> {
  private frameKey = newFrameKey();

  constructor(scope: Scope, elementNode: NT) {
    super(scope, elementNode);
  }

  initialize(frame: Frame): void {
    frame.set(this.frameKey, [] as Frame[]);
  }

  size(frame: Frame): number {
    return this.access(frame).length;
  }

  element(frame: Frame, index: number): Frame {
    return this.access(frame)[index];
  }

  insert(frame: Frame, beforeIndex: number | undefined, initializer: (elementNode: NT, frame: Frame) => void): void {
    const elementFrame = frame.newChild();
    initializer(this.elementNode, elementFrame);

    const array = this.access(frame);
    const index = beforeIndex !== undefined ? beforeIndex : array.length;
    array.splice(index, 0, elementFrame);

    this.broadcastElementInsertedEvent(frame, index);
  }

  delete(frame: Frame, index: number): void {
    const array = this.access(frame);
    array.splice(index);
    this.broadcastElementDeletedEvent(frame, index);
  }

  private access(frame: Frame): Frame[] {
    const array = frame.get(this.frameKey);
    if (array === undefined) {
      throw 'undefined array';
    }
    return array as Frame[];
  }
}
