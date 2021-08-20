import { ArgumentId, InstanceNode, newNodeId, NodeId } from "./block/index.js";
import { ObjectValue } from "./object-value.js";
import { objectArgumentId, PropertyFunctor } from "./object/index.js";
import { addNode } from "./scope.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export function property<O extends {}, K extends keyof O>(
    value: ObjectValue<O>, key: K)
: O[K] extends ValueType ? Value<O[K]> : never {
  const nodeId = newNodeId();
  const argumentMap: Map<ArgumentId, NodeId> = new Map([[objectArgumentId, value.reference()]]);
  const node: InstanceNode = {
    type: 'instance',
    functor: new PropertyFunctor<O, K>(key),
    arguments: argumentMap,
  };

  return addNode(nodeId, node).newFacade<ObjectValue<O>>(ObjectValue) as never;
}
