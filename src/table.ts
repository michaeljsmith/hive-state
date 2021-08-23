import { InstanceNode, newNodeId } from "./block/index.js";
import { addLambdaNode, addNode, scopeExists } from "./scope.js";
import { MutableTableValue } from "./table-value.js";
import { elementArgumentId, TableFunctor } from "./table/index.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function table<T extends ValueType>(fn: () => Value<T>): MutableTableValue<T> {
  if (!scopeExists()) {
    throw 'no scope exists';
  }

  // TODO: Do this lazily to allow recursion.
  const {block, lambdaValue} = addLambdaNode(fn);

  // Create a new node to represent the table.
  const nodeId = newNodeId();
  const node: InstanceNode = {
    type: 'instance',
    functor: new TableFunctor(block),
    arguments: new Map([[elementArgumentId, lambdaValue.reference()]]),
  };

  return addNode(nodeId, node).newFacade<MutableTableValue<T>>(MutableTableValue);
}
