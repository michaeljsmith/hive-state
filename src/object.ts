import { ArgumentId, asArgumentId } from "./block/argument-id.js";
import { InstanceNode } from "./block/index.js";
import { newNodeId, NodeId } from "./block/node-id.js";
import { ObjectValue } from "./object-value.js";
import { ObjectFunctor } from "./object/index.js";
import { addNode } from "./scope.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function object<O extends {}>(input: {[K in keyof O]: O[K] extends ValueType ? Value<O[K]> : never}): ObjectValue<O> {
  const nodeId = newNodeId();
  const argumentMap: Map<ArgumentId, NodeId> = new Map();
  for (const key in input) {
    argumentMap.set(asArgumentId(key), input[key].reference());
  }
  const node: InstanceNode = {
    type: 'instance',
    functor: new ObjectFunctor(),
    arguments: argumentMap,
  };

  return addNode(nodeId, node).newFacade<ObjectValue<O>>(ObjectValue);
}
