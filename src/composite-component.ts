import { ArgumentId } from "./argument-id.js";
import { Component, ComponentContext } from "./component.js";
import { FrameKey } from "./frame.js";
import { InstanceId } from "./instance-id";
import { Change, Query, ValueType } from "./value-type.js";

export type Instance = {
  id: number;
  component: Component<[], ValueType>;
  frameKey: FrameKey;
  dependencies: Map<ArgumentId, InstanceId>;
};

type Observer = {
  instanceId: number;
  argumentId: number;
};

type Node = {
  instance: Instance;
  observers: Observer[];
};

export class CompositeComponent<Inputs extends ValueType[], O extends ValueType> implements Component<Inputs, O> {
  private nodes: Node[] = [];
  private nodesById: Map<number, number> = new Map;

  constructor(instances: Instance[]) {
    this.addInstances(instances);
  }

  handleInputChange<InputKey extends number>(context: ComponentContext<Inputs, O>, inputKey: InputKey, change: Change<Inputs[InputKey]>): void {
    asdf();
  }

  handleOutputQuery<R>(context: ComponentContext<Inputs, O>, query: Query<O, R>): R {
  }

  private addInstances(instances: Instance[]) {
    for (const instance of instances) {
      const nodeIndex = this.nodes.length;
      this.nodes.push({
        instance,
        observers: [],
      });

      this.nodesById.set(instance.id, nodeIndex);

      for (const dependency of instance.dependencies) {

      }
    }
  }
}
