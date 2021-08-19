import { Accessor } from "./accessor.js";
import { ArgumentId } from "./argument-id.js";
import { Change } from "./change.js";
import { NodeContext } from "./node-context.js";

export interface Functor {
  construct(context: NodeContext): {} | undefined;
  handleArgumentChanges(data: {} | undefined, context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined;
  accessor(data: {} | undefined, context: NodeContext): Accessor;
}
