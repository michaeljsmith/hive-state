import { Node } from "../node.js";
import { VectorNode } from "./vector-node.js";
import { BaseVectorNode } from "./base-vector-node";
import { Frame } from "frame.js";

export class MapVectorNode<NT extends Node, NU extends Node> extends BaseVectorNode<NU> {
  private input: VectorNode<NT>;

  constructor(
      input: VectorNode<NT>,
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

  initialize(frame: Frame): void {
    // No initialization required.
  }

  size(frame: Frame): number {
    return this.input.size(frame);
  }

  element(frame: Frame, index: number): Frame {
    return this.input.element(frame, index);
  }
}
