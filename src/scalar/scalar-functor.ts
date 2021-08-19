import { ArgumentId, brandAsAccessor, Change, Functor, NodeContext } from "../block/index.js";
import { MutableScalarAccessor, ScalarMutator } from "./scalar-type.js";

interface ScalarData<T> {
  value: T;
}

export class ScalarFunctor<T> implements Functor {
  private initialValue: T;

  constructor(initialValue: T) {
    this.initialValue = initialValue;
  }

  construct(_context: NodeContext): {} | undefined {
    const data: ScalarData<T> = {
      value: this.initialValue,
    };
    return data;
  }

  handleArgumentChanges(_data: {} | undefined, _context: NodeContext, _argumentChanges: Map<ArgumentId, Change>): Change | undefined {
    return undefined;
  }

  accessor(data: {} | undefined, context: NodeContext): MutableScalarAccessor<T> {
    const scalarData = data as ScalarData<T> | undefined;
    if (scalarData === undefined) {
      throw 'Missing data';
    }

    return brandAsAccessor<MutableScalarAccessor<T>>({
      get() {
        return scalarData.value;
      },

      setter() {
        return (value) => {
          // Update the value.
          scalarData.value = value;

          // Propagate the change.
          context.handleOutputChange((mutator: ScalarMutator<T>) => mutator.set(value));
        };
      },
    });
  }
}
