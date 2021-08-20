import { ArgumentId, ArgumentNode, asArgumentId, BlockFunctor, InstanceNode, newNodeId, NodeId } from "./block/index.js";
import { LambdaNode } from "./block/lambda-node.js";
import { addNode, inScope, scopeExists } from "./scope.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function lambda<Args extends Value<ValueType>[], T extends ValueType> (
    fn: (...args: Args) => Value<T>)
: (...args: Args) => Value<T> {

  if (!scopeExists()) {
    throw 'no scope exists';
  }

  // TODO: Do this lazily to allow recursion.
  const {block, captures} = inScope(() => {
    // Add nodes to represent the arguments.
    const argumentValues = [...Array(fn.length).keys()].map((i) => {
      const argNodeId = newNodeId();
      const argNode: ArgumentNode = {
        type: 'argument',
        argumentId: asArgumentId(i.toString()),
      };
      return addNode(argNodeId, argNode);
    })

    return fn(...(argumentValues as Args));
  });

  // Add a lambda node
  const lambdaNodeId = newNodeId();
  const lambdaNode: LambdaNode = {
    type: 'lambda',
    captures,
  };
  const lambdaValue = addNode(lambdaNodeId, lambdaNode);

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
