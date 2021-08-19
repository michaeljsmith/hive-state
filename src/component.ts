import { ArgumentId, ArgumentNode, asArgumentId, BlockFunctor, InstanceNode, newNodeId, NodeId } from "./block/index.js";
import { addNode, inRootScope } from "./scope.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function component<Args extends Value<ValueType>[], T extends ValueType> (
    fn: (...args: Args) => Value<T>)
: (...args: Args) => Value<T> {

  // TODO: Do this lazily to allow recursion.
  const block = inRootScope(() => {
    // Add nodes to represent the arguments.
    const argumentValues = [...Array(fn.length).keys()].map((i) => {
      const argNodeId = newNodeId();
      const argNode: ArgumentNode = {
        type: 'argument',
        argumentId: asArgumentId(i),
      };
      return addNode(argNodeId, argNode);
    })

    return fn(...(argumentValues as Args));
  });

  return (...args) => {
    // Create a new instance node.
    const nodeId = newNodeId();
    const argumentMap: Map<ArgumentId, NodeId> = new Map(args.map(
      (x, i) => [asArgumentId(i), x.nodeId]));
    const node: InstanceNode = {
      type: 'instance',
      functor: new BlockFunctor(block),
      arguments: argumentMap,
    };
    return addNode<T>(nodeId, node);
  };
}
