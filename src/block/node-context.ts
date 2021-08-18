import { ArgumentId } from "./argument-id.js";
import { Change } from "./change.js";
import { Query } from "./query.js";

export interface NodeContext {
  queryArgument<R>(argumentId: ArgumentId, query: Query<R>): R;
  handleOutputChange(change: Change): void;
}
