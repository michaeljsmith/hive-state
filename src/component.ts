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

  const {result: _, instances} = inNewScope((scope) => {
    // Create the arguments to pass to the body.
    const args = Array.from({length: fn.length}, (_, i) => {
      return {
        scope,
        reference: {type: 'input', inputId: i}
      };
    }) as unknown as Args;

    // Evaluate the body.
    // TODO: Do something with the return value of this function.
    // This should really be changing Composite so that the output node is
    // explicitly specified (rather than implicitly being the last instance).
    fn(...args);
  });

  // Create the composite node factory.
  const composite = new Composite(instances);
  const nodeFactory = (inputQuerier: InputQuerier<{}>) => composite.createNode(inputQuerier)

  // Return the node addition function.
  return (...args) => instance<Args, T>(nodeFactory, args);
}
