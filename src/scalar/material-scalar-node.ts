import { Frame, FrameKey, newFrameKey } from "../frame.js";
import { Scope } from "../scope.js";
import { BaseScalarNode } from "./base-scalar-node.js";
import { MutableScalarNode } from "./mutable-scalar-node.js";

export class MaterialScalarNode<T> extends BaseScalarNode<T> implements MutableScalarNode<T> {
  private defaultValue: T;
  private frameKey: FrameKey;

  constructor(scope: Scope, defaultValue: T) {
    super(scope);
    this.defaultValue = defaultValue;
    this.frameKey = newFrameKey();
  }

  initialize(frame: Frame): void {
    frame.set(this.frameKey, this.defaultValue);
  }

  get(frame: Frame): T {
    return frame.get(this.frameKey) as T;
  }

  set(frame: Frame, value: T): void {
    frame.set(this.frameKey, value);
  }
}
