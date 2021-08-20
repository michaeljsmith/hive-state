import { Accessor } from "../block/accessor.js";
import { AccessorFor, ChangeFor, ValueType, ValueTypeTemplate } from "../value-type.js";

export interface ObjectAccessor<O extends {}> extends Accessor {
  get<K extends keyof O>(key: K): O[K] extends ValueType ? AccessorFor<O[K]> : never;
}

export interface ObjectMutator<O extends {}> {
  mutate<K extends keyof O>(key: K, change: O[K] extends ValueType ? ChangeFor<O[K]> : never): void;
}

export type ObjectType<O extends {}> = ValueTypeTemplate<ObjectAccessor<O>, ObjectMutator<O>>;
