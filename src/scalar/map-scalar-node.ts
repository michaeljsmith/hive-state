import { Frame } from "frame.js";
import { BaseScalarNode } from "./base-scalar-node.js";
import { ScalarNode } from "./scalar-node.js";

export class MapScalarNode<T, U> extends BaseScalarNode<U> {
  private input: ScalarNode<T>;
  private mapper: (input: T) => U;

  constructor(input: ScalarNode<T>, mapper: (input: T) => U) {
    super(input.scope);

    this.input = input;
    this.mapper = mapper;
  }

  get(frame: Frame): U {
    const inputValue = this.input.get(frame);
    return this.mapper(inputValue);
  }

  initialize(frame: Frame): void {
    // Do nothing.
  }
}
