import { ValueNode } from "../value-node.js";
import { VectorNode } from "./vector-node.js";
import { BaseVectorNode } from "./base-vector-node";

export function map<T, NT extends ValueNode<T>, U, NU extends ValueNode<U>>(
    vectorNode: VectorNode<T, NT>, mapper: (element: NT) => NU)
: VectorNode<U, NU> {
  return new MapVectorNode<T, NT, U, NU>(vectorNode, mapper);
}

class MapVectorNode<T, NT extends ValueNode<T>, U, NU extends ValueNode<U>> extends BaseVectorNode<U, NU> {
  constructor(
      input: VectorNode<T, NT>,
      mapper: (element: NT) => NU) {
    const elementNode = mapper(input.elementNode);

    // Check that we are not using nodes from an incorrect scope.
    // TODO: Support referencing nodes from parent scopes.
    if (elementNode.scope !== input.elementNode.scope) {
      throw "incorrect scope";
    }

    super(input.scope, elementNode);

    // Propagate insertion/deletion events.
    input.addElementInsertedObserver((frame, index) => {
      this.broadcastElementInsertedEvent(frame, index);
    });
    input.addElementDeletedObserver((frame, index) => {
      this.broadcastElementDeletedEvent(frame, index);
    });
  }
}
