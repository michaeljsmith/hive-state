import { ArgumentId, enclosureArgumentId } from "./argument-id.js";
import { Block, BlockData } from "./block.js";
import { Change } from "./change.js";
import { constructBlock } from "./construct.js";
import { Functor } from "./functor.js";
import { LambdaChange } from "./lambda.js";
import { NodeContext } from "./node-context.js";
import { propagateChanges } from "./propagate-changes.js";
import { nodeAccessor } from "./node-accessor.js";
import { Accessor } from "./accessor.js";

export class BlockFunctor implements Functor {
  private block: Block;

  constructor(block: Block) {
    this.block = block;
  }

  construct(context: NodeContext): {} | undefined {
    return constructBlock(this.block, context);
  }

  handleArgumentChanges(data: {} | undefined, context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined {
    const blockData = data as BlockData | undefined;
    if (blockData === undefined) {
      throw "no data";
    }

    // Get the node changes from the argument changes - they are passed in as an implicit argument.
    const nodeChangeArgument = argumentChanges.get(enclosureArgumentId) as LambdaChange | undefined;
    const nodeChanges = nodeChangeArgument?.nodeChanges ?? new Map(); // TODO: Avoid this allocation by allowing undefined.

    return propagateChanges(this.block, blockData, argumentChanges, nodeChanges);
  }

  accessor(data: {} | undefined, context: NodeContext): Accessor {
    const blockData = data as BlockData | undefined;
    if (blockData === undefined) {
      throw "no data";
    }

    return nodeAccessor(this.block, blockData, this.block.outputNodeId);
  }
}
