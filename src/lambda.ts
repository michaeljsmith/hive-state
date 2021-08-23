import { ArgumentId, asArgumentId, BlockFunctor, InstanceNode, newNodeId, NodeId } from "./block/index.js";
import { addLambdaNode, addNode, scopeExists } from "./scope.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function lambda<Args extends Value<ValueType>[], T extends ValueType> (
    fn: (...args: Args) => Value<T>)
: (...args: Args) => Value<T> {

  if (!scopeExists()) {
    throw 'no scope exists';
  }

  // TODO: Do this lazily to allow recursion.
  const {block, lambdaValue} = addLambdaNode(fn);

  return (...args) => {
    // Create a new instance node.
    const nodeId = newNodeId();
    const argumentMap: Map<ArgumentId, NodeId> = new Map(args.map(
      (x, i) => [asArgumentId(i.toString()), x.reference()]));
    const node: InstanceNode = {
      type: 'instance',
      functor: new BlockFunctor(block),
      lambdaNodeId: lambdaValue.reference(),
      arguments: argumentMap,
    };
    return addNode<T>(nodeId, node);
  };
}
