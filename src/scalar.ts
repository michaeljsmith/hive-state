import { InstanceNode, newNodeId } from "./block/index.js";
import { MutableScalarValue } from "./scalar-value.js";
import { ScalarFunctor } from "./scalar/scalar-functor.js";
import { addNode } from "./scope.js";

export function scalar<T>(initialValue: T): MutableScalarValue<T> {
  // Create a new node to represent the variable.
  const nodeId = newNodeId();
  const node: InstanceNode = {
    type: 'instance',
    functor: new ScalarFunctor(initialValue),
    arguments: new Map(),
  };

  return addNode(nodeId, node).newFacade<MutableScalarValue<T>>(MutableScalarValue);
}
