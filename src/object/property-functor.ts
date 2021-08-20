import { Accessor, ArgumentId, asArgumentId, Change, Functor, NodeContext } from "../block/index.js";
import { ObjectAccessor, ObjectMutator } from "./object-type.js";

export const objectArgumentId = asArgumentId("object");

export class PropertyFunctor<O extends {}, K extends keyof O> implements Functor {
  private key: K;

  constructor(key: K) {
    this.key = key;
  }

  construct(context: NodeContext): {} | undefined {
    return undefined;
  }

  handleArgumentChanges(data: {} | undefined, context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined {
    const objectChanges = argumentChanges.get(objectArgumentId);
    if (objectChanges === undefined) {
      return undefined;
    }

    // Find the change to the object that affected this property, if any.
    // TODO: Replace this way of reporting changes with a more efficient one so we
    // can quickly find the appropriate change.
    const self = this;
    const propertyChange: (Change | undefined)[] = [undefined];
    const objectMutator: ObjectMutator<O> = {
      mutate<K extends keyof O>(key: K, change: Change) {
        if (key as unknown === self.key) {
          propertyChange[0] = change;
        }
      }
    };
    objectChanges(objectMutator as never);

    return propertyChange[0];    
  }

  accessor(data: {} | undefined, context: NodeContext): Accessor {
    const objectAccessor = context.argumentAccessor(objectArgumentId) as ObjectAccessor<O>;
    return objectAccessor.get(this.key) as Accessor;
  }
}
