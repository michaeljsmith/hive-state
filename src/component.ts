import { Composite, InstanceInput } from "./composite.js";
import { InputQuerier } from "./input-querier.js";
import { instance } from "./instance";
import { inNewScope, Scope } from "./scope.js";
import { ValueType } from "./value-type.js";

export interface Value<T extends ValueType> {
  __typeBrand: T;
  scope: Scope,
  reference: InstanceInput,
}

export function component<Args extends Value<ValueType>[], T extends ValueType>(
    fn: (...args: Args) => Value<T>)
: (...args: Args) => Value<T> {

  const {result: resultValue, instances} = inNewScope((scope) => {
    // Create the arguments to pass to the body.
    const args = Array.from({length: fn.length}, (_, i) => {
      return {
        scope,
        reference: {type: 'input', inputId: i}
      };
    }) as unknown as Args;

    // Evaluate the body.
    return fn(...args);
  });

  // Create the composite node factory.
  const composite = new Composite(instances, resultValue.reference);
  const nodeFactory = (inputQuerier: InputQuerier<{}>) => composite.createNode(inputQuerier)

  // Return the node addition function.
  return (...args) => instance<Args, T>(nodeFactory, args);
}
