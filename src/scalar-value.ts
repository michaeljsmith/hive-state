import { native } from "./native.js";
import { ScalarType } from "./scalar/index.js";
import { Value } from "./value.js";

export class ScalarValue<T> extends Value<ScalarType<T>> {
  map<U>(fn: (input: T) => U): ScalarValue<U> {
    return native(fn)(this);
  }
}
