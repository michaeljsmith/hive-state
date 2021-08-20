import { ObjectType } from "./object/index.js";
import { property } from "./property.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export class ObjectValue<O extends {}> extends Value<ObjectType<O>> {
  get<K extends keyof O>(key: K): O[K] extends ValueType ? Value<O[K]> : never {
    return property(this, key);
  }
}
