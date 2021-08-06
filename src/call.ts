import { NodeFactory } from "./Node.js";
import { ScalarAccessor, ScalarType } from "./scalar-type.js";
import { Frame } from "./stack.js";

export function call<Args extends unknown[], T>(fn: (...args: Args) => T)
: NodeFactory<{[K in keyof Args]: ScalarType<Args[K]>}, ScalarType<T>> {
  return (inputQuerier) => {
    function evaluate(stack: Frame): T {
      const arity = fn.length;
      const args = Array.from({length: arity}, (_, i) => {
        const argumentKey: keyof Args = i;
        return inputQuerier(stack, argumentKey, ((accessor: ScalarAccessor<unknown>) => accessor.get()) as any);
      }) as Args;
      return fn(...args);
    }

    return {
      update(_self, stack, _changes) {
        // Regardless of the change, simply re-compute the result.
        return (mutator) => mutator.set(evaluate(stack));
      },

      query(_self, stack, query) {
        return query({
          get() {
            return evaluate(stack);
          },
        });
      },
    };
  };
}
