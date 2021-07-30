import { Frame } from "../frame.js";
import { MutableScalarNode } from "scalar/mutable-scalar-node.js";
import { childScope, Scope } from "../scope.js";
import { MutableVectorNode } from "vector/mutable-vector-node.js";
import { BaseNode } from "../base-node.js";
import { RecordNode } from "./record-node.js";
import { MaterialScalarNode } from "scalar/material-scalar-node.js";
import { MaterialVectorNode } from "vector/material-vector-node.js";
import { Node } from "../node.js";

export class RecordNodeImpl extends BaseNode implements RecordNode {
  private fields: Node[] = [];

  constructor(scope: Scope) {
    super(scope);
  }

  scalarField<T>(defaultValue: T): MutableScalarNode<T> {
    const field = new MaterialScalarNode<T>(this.scope, defaultValue);
    this.fields.push(field);
    return field;
  }

  vectorField(): MutableVectorNode<RecordNode> {
    const elementScope = childScope(this.scope);
    const elementNode = new RecordNodeImpl(elementScope);
    const field = new MaterialVectorNode(this.scope, elementNode);
    this.fields.push(field);
    return field;
  }

  initialize(frame: Frame): void {
    for (const field of this.fields) {
      field.initialize(frame);
    }
  }
}
