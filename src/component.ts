import { Frame } from "./stack.js";
import { Change, Query, ValueType } from "./value-type.js";

export type InputQuerier<Inputs extends {}> = <InputKey extends keyof Inputs, R>(
    stack: Frame,
    inputKey: InputKey,
    query: Inputs[InputKey] extends ValueType ? Query<Inputs[InputKey], R> : never)
  => R;

export interface Node<Inputs extends {}, O extends ValueType> {
  construct?: (stack: Frame) => {};
  update(self: unknown, stack: Frame, changes: {[K in keyof Inputs]?: Inputs[K] extends ValueType ? Change<Inputs[K]> : never}): Change<O>;
  query<R>(self: unknown, stack: Frame, query: Query<O, R>): R;
}
