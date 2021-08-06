import { Composite, Instance, InstanceInput } from "./composite.js";
import { newInstanceId } from "./instance-id.js";
import { ValueType } from "./value-type.js";

interface InstanceSet {
  instances: Instance<{}>[];
}

export interface Value<T extends ValueType> {
  __typeBrand: T;
  instanceSet: InstanceSet,
  reference: InstanceInput<{}>,
}

// TODO: Switch this so that is parameterized on Value<ValueType>[] rather
// than ValueType[], since we almost always use Value<ValueType>.
export function component<Args extends ValueType[], T extends ValueType>(
    fn: (...args: {[K in keyof Args]: CoerceValue<Args[K]>}) => Value<T>)
: (...args: {[K in keyof Args]: CoerceValue<Args[K]>}) => Value<T> {

  const instanceSet: InstanceSet = {
    instances: []
  };

  // Create the arguments to pass to the body.
  const args = Array.from({length: fn.length}, (_, i) => {
    return {
      instanceSet,
      reference: {type: 'input', inputId: i}
    };
  }) as unknown as {[K in keyof Args]: CoerceValue<Args[K]>};

  // Evaluate the body.
  const resultValue = fn(...args);

  // Create the composite node factory.
  const composite = new Composite(instanceSet.instances);

  // Return the node addition function.
  return (...args) => {
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
    instanceSet.instances.push({
      id: instanceId,
      nodeFactory: (inputQuerier) => composite.createNode(inputQuerier),
      inputs: new Map(args.map((arg, i) => [i.toString(), arg.reference])),
    });
    return {
      instanceSet: outputInstanceSet,
      reference: {type: "instance", instanceId},
    } as Value<T>;
  };
}

// For some reason the mapped tuple type below doesn't seem to propagate the
// type constraint (extends ValueType) properly, so we can't directly map to
// Value<Args[K]> as 'keyof' the tuple seems to give string | number | symbol
// rather than an enumeration of the indices (using Typescript 4.3.5).
//
// Given this I'm not actually sure how the correct types are inferred, but it
// seems to work out doing this.
type CoerceValue<T> = T extends ValueType ? Value<T> : never;
