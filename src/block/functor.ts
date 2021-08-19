import { ArgumentId } from "./argument-id.js";
import { Change } from "./change.js";
import { NodeContext } from "./node-context.js";
import { Query } from "./query.js";

export interface Functor {
  construct(context: NodeContext): {} | undefined;
  handleArgumentChanges(data: {} | undefined, context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined;
  handleQuery<R>(data: {} | undefined, context: NodeContext, query: Query<R>): R;
}