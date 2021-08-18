import { InstanceNode, newNodeId } from "./block/index.js";
import { ScalarType } from "./scalar/index.js";
import { ScalarFunctor } from "./scalar/scalar-functor.js";
import { addNode, currentScope } from "./scope.js";
import { Value } from "./value.js";

export function scalar<T>(initialValue: T): Value<ScalarType<T>> {
    // Create a new node to represent the variable.
    const nodeId = newNodeId();
    const node: InstanceNode = {
      type: 'instance',
      functor: new ScalarFunctor(initialValue),
      arguments: new Map(),
    };

    return addNode(nodeId, node);
}
