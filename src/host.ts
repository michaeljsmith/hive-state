import { constructBlock, NodeContext } from "./block/index.js";
import { nodeAccessor } from "./block/node-accessor.js";
import { inRootScope } from "./scope.js";
import { AccessorFor, ChangeFor, ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function host<T extends ValueType>(fn: () => Value<T>, callback?: (change: ChangeFor<T>) => void): AccessorFor<T> {
  // Get the block.
  const block = inRootScope(() => fn());

  // Create the context for the block.
  const context: NodeContext = {
    handleOutputChange(change) {
      callback?.(change as ChangeFor<T>);
    },

    argumentAccessor(_argumentId) {
      // This shouldn't get called as we aren't specifying any arguments.
      throw 'unexpected query';
    }
  };

  // Construct the block data.
  const data = constructBlock(block, context);
  return nodeAccessor(block, data, block.outputNodeId) as AccessorFor<T>;
}
