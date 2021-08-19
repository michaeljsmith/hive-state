import { NodeId } from "./block/node-id.js";
import { Scope } from "./scope.js";
import { ValueType } from "./value-type.js";

export class Value<T extends ValueType> {
  __typeBrand!: T;
  scope: Scope;
  nodeId: NodeId;

  constructor(scope: Scope, nodeId: NodeId) {
    this.scope = scope;
    this.nodeId = nodeId;
  }

  newFacade<Facade extends Value<T>>(ctor: new (scope: Scope, nodeId: NodeId) => Facade): Facade {
    return new ctor(this.scope, this.nodeId);
  }
}
