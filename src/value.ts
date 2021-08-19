import { NodeId } from "./block/node-id.js";
import { Scope } from "./scope.js";
import { ValueType } from "./value-type.js";

export interface Value<T extends ValueType> { 
  __typeBrand: T;
  scope: Scope;
  nodeId: NodeId;
}

export function brandAsValue<T extends ValueType>(
    value: Omit<Value<T>, "__typeBrand">)
: Value<T> {
  return value as Value<T>;
}

// export type ValueTypeOf<V extends Value<ValueType>> = V extends Value<infer T> ? T : never;