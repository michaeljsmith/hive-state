import { ArgumentId } from "./argument-id.js";
import { BlockData, Block } from "./block.js";
import { Change } from "./change.js";
import { Functor } from "./functor.js";
import { NodeContext, NodeContextData } from "./node-context.js";
import { NodeId } from "./node-id.js";
import { PrimitiveNode } from "./primitive-node.js";
import { propagateNodeChange } from "./propagate-changes.js";
import { queryArgument } from "./query-argument.js";
import { Query } from "./query.js";

export class PrimitiveNodeImpl implements PrimitiveNode {
  type: "primitive";
  nodeId: NodeId;
  arguments: Map<ArgumentId, NodeId>;
  parent: Block;
  functor: Functor;
  functorContext: NodeContext;

  constructor(
      nodeId: NodeId,
      arguments_: Map<ArgumentId, NodeId>,
      parent: Block,
      functor: Functor) {
    this.type = 'primitive';
    this.nodeId = nodeId;
    this.arguments = arguments_;
    this.parent = parent;
    this.functor = functor;

    this.functorContext = {
      queryArgument(data, argumentId, query) {
        const parentData = data as unknown as BlockData;
        return queryArgument(parent, parentData, nodeId, argumentId, query);
      },

      handleOutputChange(data, change) {
        const parentData = data as unknown as BlockData;
        propagateNodeChange(parent, parentData, nodeId, change);
      },
    };
  }

  construct(caller: BlockData): {} | undefined {
    return this.functor.construct(this.functorContext, caller as unknown as NodeContextData);
  }

  handleArgumentChanges(data: {} | undefined, caller: BlockData, argumentChanges: Map<ArgumentId, Change | undefined>): Change | undefined {
    return this.functor.handleArgumentChanges(data, this.functorContext, caller as unknown as NodeContextData, argumentChanges);
  }

  handleQuery<R>(data: {} | undefined, caller: BlockData, query: Query<R>): R {
    return this.functor.handleQuery(data, this.functorContext, caller as unknown as NodeContextData, query);
  }
}
