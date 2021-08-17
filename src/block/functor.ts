import { ArgumentId } from "./argument-id.js";
import { BlockData } from "./block.js";
import { Change } from "./change.js";
import { NodeContext, NodeContextData } from "./node-context.js";
import { Query } from "./query.js";

export interface Functor {
  construct(context: NodeContext, contextData: NodeContextData): {} | undefined;
  handleArgumentChanges(data: {} | undefined, context: NodeContext, contextData: NodeContextData, argumentChanges: Map<ArgumentId, Change | undefined>): Change | undefined;
  handleQuery<R>(data: {} | undefined, context: NodeContext, contextData: NodeContextData, query: Query<R>): R;
}
