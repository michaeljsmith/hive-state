import { Composite, InstanceInput } from "./composite.js";
import { InputQuerier } from "./input-querier.js";
import { instance } from "./instance";
import { InstanceSet } from "./instance-set";
import { ValueType } from "./value-type.js";

export interface Value<T extends ValueType> {
  __typeBrand: T;
  instanceSet: InstanceSet,
  reference: InstanceInput<{}>,
}

export function component<Args extends Value<ValueType>[], T extends ValueType>(
    fn: (...args: Args) => Value<T>)
: (...args: Args) => Value<T> {

  const instanceSet: InstanceSet = {
    instances: []
  };

  // Create the arguments to pass to the body.
  const args = Array.from({length: fn.length}, (_, i) => {
    return {
      instanceSet,
      reference: {type: 'input', inputId: i}
    };
  }) as Args;

  // Evaluate the body.
  // TODO: Do something with the return value of this function.
  // This should really be changing Composite so that the output node is
  // explicitly specified (rather than implicitly being the last instance).
  fn(...args);

  // Create the composite node factory.
  const composite = new Composite(instanceSet.instances);
  const nodeFactory = (inputQuerier: InputQuerier<{}>) => composite.createNode(inputQuerier)

  // Return the node addition function.
  return (...args) => instance<Args, T>(nodeFactory, args);
}
