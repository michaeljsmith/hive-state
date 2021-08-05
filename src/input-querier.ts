import { Frame } from "./stack.js";
import { Query, ValueType } from "./value-type.js";

export type InputQuerier<Inputs extends {}> = <InputKey extends keyof Inputs, R>(
    stack: Frame,
    inputKey: InputKey,
    query: Inputs[InputKey] extends ValueType ? Query<Inputs[InputKey], R> : never)
  => R;


