import { ArgumentId, asArgumentId, InstanceNode, newNodeId, NodeId } from "./block/index.js";
import { ScalarValue } from "./scalar-value.js";
import { NativeFunctor, ScalarType } from "./scalar/index.js";
import { addNode } from "./scope.js";
import { Value } from "./value.js";

export function native<Args extends unknown[], T> (
    fn: (...args: Args) => T)
: (...args: {[K in keyof Args]: Value<ScalarType<Args[K]>>}) => ScalarValue<T> {
  return (...args) => {
    // Create a new node to represent the mapping.
    const nodeId = newNodeId();
    const argumentMap: Map<ArgumentId, NodeId> = new Map(args.map(
      (x, i) => [asArgumentId(i.toString()), x.reference()]));
    const node: InstanceNode = {
      type: 'instance',
      functor: new NativeFunctor(fn as (...args: unknown[]) => unknown),
      arguments: argumentMap,
    };

    return addNode(nodeId, node).newFacade<ScalarValue<T>>(ScalarValue);
  };
}
