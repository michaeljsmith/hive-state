import { ArgumentId } from "./argument-id.js";
import { BaseParametricData, BaseParametricNode } from "./base-parametric-node.js";
import { BlockData } from "./block.js";
import { Change } from "./change.js";
import { Query } from "./query.js";

export interface PrimitiveNode extends BaseParametricNode {
  type: 'primitive';
  construct(caller: BlockData): BaseParametricData | undefined;
  handleArgumentChanges(data: BaseParametricData | undefined, caller: BlockData, argumentChanges: Map<ArgumentId, Change | undefined>): Change | undefined;
  handleQuery<R>(data: BaseParametricData | undefined, caller: BlockData, query: Query<R>): R;
}
