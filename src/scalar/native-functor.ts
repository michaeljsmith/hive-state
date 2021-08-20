import { ArgumentId, asArgumentId, brandAsAccessor, Change, Functor, NodeContext } from "../block/index.js";
import { ScalarAccessor, ScalarMutator } from "./scalar-type.js";

export class NativeFunctor implements Functor {
  private fn: (...args: unknown[]) => unknown;

  constructor(fn: (...args: unknown[]) => unknown) {
    this.fn = fn;
  }

  construct(_context: NodeContext): {} | undefined {
    return undefined;
  }

  handleArgumentChanges(_data: {} | undefined, context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined {
    if (argumentChanges.size == 0) {
      return undefined;
    }

    const value = this.evaluate(context);
    return (mutator: ScalarMutator<unknown>) => mutator.set(value);
  }

  accessor(_data: {} | undefined, context: NodeContext): ScalarAccessor<unknown> {
    const self = this;
    return brandAsAccessor<ScalarAccessor<unknown>>({
      get() {
        const value = self.evaluate(context);
        return value;
      },
    });
  }

  private evaluate(context: NodeContext): unknown {
    const args = [...Array(this.fn.length).keys()].map((x) => this.evaluateArgument(context, x));
    return this.fn(...args);
  }

  private evaluateArgument(context: NodeContext, argumentIndex: number) {
    const argumentAccessor = context.argumentAccessor(asArgumentId(argumentIndex)) as ScalarAccessor<unknown>;
    return argumentAccessor.get();
  }
}
