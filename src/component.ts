import { Change, Query, ValueType } from "./value-type.js";

export interface ComponentContext<Inputs extends ValueType[], O extends ValueType> {
  handleInputQuery<InputKey extends number, R>(inputKey: InputKey, query: Query<Inputs[InputKey], R>): R;
  handleOutputChange(change: Change<O>): void;
}

export interface Component<Inputs extends ValueType[], O extends ValueType> {
  handleInputChange<InputKey extends number>(context: ComponentContext<Inputs, O>, inputKey: InputKey, change: Change<Inputs[InputKey]>): void;
  handleOutputQuery<R>(context: ComponentContext<Inputs, O>, query: Query<O, R>): R;
}
