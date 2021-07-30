import { Frame, newFrameKey } from "frame.js";
import { Scope } from "scope.js";
import { Node } from "../node.js";
import { BaseVectorNode } from "./base-vector-node.js";
import { MutableVectorNode } from "./mutable-vector-node.js"

export class MaterialVectorNode<T extends Node> extends BaseVectorNode<T> implements MutableVectorNode<T> {
  private frameKey = newFrameKey();

  constructor(scope: Scope, elementNode: T) {
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

  insert(frame: Frame, beforeIndex: number | undefined, initializer: (elementNode: T, frame: Frame) => void): void {
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
    return array as Frame[];
  }
}
