import { Node } from "../node.js";
import { VectorNode } from "./vector-node.js";
import { BaseVectorNode } from "./base-vector-node";
import { Frame } from "frame.js";

export function map<T, NT extends Node<T>, U, NU extends Node<U>>(
    vectorNode: VectorNode<T, NT>, mapper: (element: NT) => NU)
: VectorNode<U, NU> {
  return new MapVectorNode<T, NT, U, NU>(vectorNode, mapper);
}

class MapVectorNode<T, NT extends Node<T>, U, NU extends Node<U>> extends BaseVectorNode<U, NU> {
  private input: VectorNode<T, NT>;

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

    this.input = input;

    // Propagate insertion/deletion events.
    input.addElementInsertedObserver((frame, index) => {
      this.broadcastElementInsertedEvent(frame, index);
    });
    input.addElementDeletedObserver((frame, index) => {
      this.broadcastElementDeletedEvent(frame, index);
    });
  }

  size(frame: Frame): number {
    return this.input.size(frame);
  }

  element(frame: Frame, index: number): Frame {
    return this.input.element(frame, index);
  }
}
