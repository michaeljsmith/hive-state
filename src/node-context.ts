import { ArgumentId } from "./argument-id.js";
import { Change } from "./change.js";
import { Query } from "./query.js";

export interface NodeContext {
  queryArgument<R>(data: NodeContextData, argumentId: ArgumentId, query: Query<R>): R;
  handleOutputChange(data: NodeContextData, change: Change): void;
}

export interface NodeContextData {
  context: {};
}
