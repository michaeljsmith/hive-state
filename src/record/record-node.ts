import { MutableScalarNode } from "scalar/mutable-scalar-node.js";
import { MutableVectorNode } from "vector/mutable-vector-node.js";
import { Node } from "../node.js";

export interface RecordNode extends Node {
  scalarField<T>(defaultValue: T): MutableScalarNode<T>;
  vectorField(): MutableVectorNode<RecordNode>;
}
