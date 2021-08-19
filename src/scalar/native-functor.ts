import { asArgumentId } from "../block/argument-id.js";
import { ArgumentId, Change, Functor, NodeContext, Query } from "../block/index.js";
import { QueryFor } from "../value-type.js";
import { ScalarMutator, ScalarType } from "./scalar-type.js";

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

  handleQuery<R>(_data: {} | undefined, context: NodeContext, query: Query<R>): R {
    const scalarQuery = query as QueryFor<ScalarType<unknown>, R>;
    const value = this.evaluate(context);
    return scalarQuery({get() {return value;}});
  }

  private evaluate(context: NodeContext): unknown {
    const args = [...Array(this.fn.length).keys()].map((x) => this.evaluateArgument(context, x));
    return this.fn(args);
  }

  private evaluateArgument(context: NodeContext, argumentIndex: number) {
    const query: QueryFor<ScalarType<unknown>, unknown> = (accessor) => accessor.get();
    context.queryArgument(asArgumentId(argumentIndex), query);
  }
}
