import { ValueNode } from "../value-node.js";
import { BaseVectorNode, VectorNode } from "./vector-node.js";

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
