import { newInstanceId } from "./instance-id.js";
import { NodeFactory } from "./Node.js";
import { ValueType } from "./value-type.js";
import { Value } from "./component";
import { currentScope } from "./scope.js";

export function instance<Args extends Value<ValueType>[], T extends ValueType>(
    nodeFactory: NodeFactory<{}, ValueType>, args: Args)
: Value<T> {
  const scope = currentScope();

  // Check scopes of inputs.
  for (const arg of args) {
    if (arg.scope !== scope) {
      // TODO: Support referencing parent scopes.
      throw 'incompatible instance sets';
    }
  }

  const instanceId = newInstanceId();
  scope.instances.push({
    id: instanceId,
    nodeFactory,
    inputs: new Map(args.map((arg, i) => [i.toString(), arg.reference])),
  });
  return {
    scope,
    reference: { type: "instance", instanceId },
  } as Value<T>;
}
