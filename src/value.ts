import { NodeId } from "./block/node-id.js";
import { referenceNode } from "./scope.js";
import { ValueType } from "./value-type.js";

export class Value<T extends ValueType> {
  __typeBrand!: T;
  private nodeId: NodeId;

  constructor(nodeId: NodeId) {
    this.nodeId = nodeId;
  }

  internalGetNodeId(): NodeId {
    return this.nodeId;
  }

  reference(): NodeId {
    referenceNode(this.nodeId);
    return this.nodeId;
  }

  newFacade<Facade extends Value<T>>(ctor: new (nodeId: NodeId) => Facade): Facade {
    return new ctor(this.nodeId);
  }
}
