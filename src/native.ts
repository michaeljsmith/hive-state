import { ArgumentId, asArgumentId, InstanceNode, newNodeId, NodeId } from "./block/index.js";
import { NativeFunctor, ScalarType } from "./scalar/index.js";
import { addNode, currentScope } from "./scope.js";
import { brandAsValue, Value } from "./value.js";

export function native<Args extends unknown[], T> (
    fn: (...args: Args) => T)
: (...args: Value<ScalarType<Args>>[]) => Value<ScalarType<T>> {
  return (...args) => {
    // Create a new node to represent the mapping.
    const nodeId = newNodeId();
    const argumentMap: Map<ArgumentId, NodeId> = new Map(args.map(
      (x, i) => [asArgumentId(i), x.nodeId]));
    const node: InstanceNode = {
      type: 'instance',
      functor: new NativeFunctor(fn as (...args: unknown[]) => unknown),
      arguments: argumentMap,
    };

    return addNode(nodeId, node);
  };
}
