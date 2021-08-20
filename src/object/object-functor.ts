import { Accessor, ArgumentId, brandAsAccessor, Change, Functor, NodeContext } from "../block/index.js";
import { ObjectAccessor, ObjectMutator } from "./object-type.js";

export class ObjectFunctor<O extends {}> implements Functor {
  construct(_context: NodeContext): {} | undefined {
    return undefined;
  }

  handleArgumentChanges(_data: {} | undefined, _context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined {
    if (argumentChanges.size == 0) {
      return undefined;
    }

    return (mutator: ObjectMutator<O>) => {
      for (const [key, change] of argumentChanges) {
        mutator.mutate(key as unknown as keyof O, change as never);
      }
    };
  }

  accessor(_data: {} | undefined, context: NodeContext): Accessor {
    const self = this;
    return brandAsAccessor<ObjectAccessor<{}>>({
      get<K extends keyof O>(key: K) {
        return context.argumentAccessor(key as unknown as ArgumentId) as never;
      },
    });
  }
}
