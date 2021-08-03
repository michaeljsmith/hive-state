import { Accessor, Change, ValueType, ValueTypeTemplate } from "./value-type.js";

type ObjectAccessor<O extends {}> = {
  get<K extends keyof O>(key: K): O[K] extends ValueType ? Accessor<O[K]> : never;
};

type ObjectMutator<O extends {}> = {
  set<K extends keyof O>(key: K, change: Change<O[K] extends ValueType ? O[K] : never>): void;
};

export interface ObjectType<O extends {}> extends ValueTypeTemplate<ObjectAccessor<O>, ObjectMutator<O>> {}
