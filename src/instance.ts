import { newInstanceId } from "./instance-id.js";
import { InstanceSet } from "./instance-set";
import { NodeFactory } from "./Node.js";
import { ValueType } from "./value-type.js";
import { Value } from "./component";

export function instance<Args extends Value<ValueType>[], T extends ValueType>(
    nodeFactory: NodeFactory<{}, ValueType>, args: Args)
: Value<T> {
  // Find the instance set from the arguments.
  let outputInstanceSet: InstanceSet | undefined = undefined;
  for (const arg of args) {
    if (outputInstanceSet !== undefined && arg.instanceSet !== outputInstanceSet) {
      // TODO: Support referencing parent scopes.
      throw 'incompatible instance sets';
    }
    outputInstanceSet = arg.instanceSet;
  }
  if (outputInstanceSet === undefined) {
    throw 'no instance set found';
  }

  const instanceId = newInstanceId();
  outputInstanceSet.instances.push({
    id: instanceId,
    nodeFactory,
    inputs: new Map(args.map((arg, i) => [i.toString(), arg.reference])),
  });
  return {
    instanceSet: outputInstanceSet,
    reference: { type: "instance", instanceId },
  } as Value<T>;
}
