import { InputQuerier } from "./input-querier.js";
import { Frame } from "./stack.js";
import { Change, Query, ValueType } from "./value-type.js";

export interface Node<Inputs extends {}, O extends ValueType> {
  construct?: (stack: Frame) => {};
  update(self: unknown, stack: Frame, changes: {
    [K in keyof Inputs]?: Inputs[K] extends ValueType ? Change<Inputs[K]> : never;
  }): Change<O>;
  query<R>(self: unknown, stack: Frame, query: Query<O, R>): R;
}

export type NodeFactory<Inputs extends {}, O extends ValueType> =
  (inputQuerier: InputQuerier<Inputs>) => Node<Inputs, O>;
