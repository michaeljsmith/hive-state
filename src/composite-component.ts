import { Component, InputQuerier } from "./component.js";
import { FrameKey, newFrameKey } from "./frame.js";
import { InstanceId } from "./instance-id";
import { Frame, pop } from "./stack.js";
import { Change, Query, ValueType } from "./value-type.js";

export type InstanceInput<Inputs extends {}> =
  { type: 'input', inputId: keyof Inputs } |
  { type: 'instance', instanceId: InstanceId };

export type Instance<Inputs extends {}> = {
  id: InstanceId;
  component: Component<{}, ValueType>;
  frameKey: FrameKey;
  inputs: Map<string, InstanceInput<Inputs>>;
};

type Observer = {
  instanceId: InstanceId;
  argumentId: string;
};

type Node<Inputs extends {}> = {
  instance: Instance<Inputs>;
  frameKey: FrameKey | undefined;
  observers: Observer[];
};

type CompositeData = {
  [key: string]: {};
};

export class CompositeComponent<Inputs extends {}, O extends ValueType> implements Component<Inputs, O> {
  private nodes: Node<Inputs>[] = [];
  private nodesById: Map<number, number> = new Map;
  private inputObservers: {[K in keyof Inputs]?: Observer[]} = {};

  constructor(instances: Instance<Inputs>[]) {
    this.addInstances(instances);
  }

  construct(inputQuerier: InputQuerier<Inputs>, stack: Frame): {} {
  }

  update(
      inputQuerier: InputQuerier<Inputs>,
      self: unknown,
      stack: Frame,
      changes: {[K in keyof Inputs]?: Inputs[K] extends ValueType ? Change<Inputs[K]> : never})
  : Change<O> {

  }

  query<R>(inputQuerier: InputQuerier<Inputs>, self: unknown, stack: Frame, query: Query<O, R>): R {

  }

  private addInstances(instances: Instance<Inputs>[]) {
    for (const instance of instances) {
      //const context = this.componentContext(instance.id);
      const nodeIndex = this.nodes.length;

      // Allocate a frame key if this component requires state.
      const frameKey = instance.component.construct === undefined ? undefined : newFrameKey();

      this.nodes.push({
        instance,
        frameKey,
        //context,
        observers: [],
      });

      this.nodesById.set(instance.id, nodeIndex);

      for (const [argumentId, instanceInput] of instance.inputs) {
        if (instanceInput.type === 'input') {
          let inputObservers: Observer[] | undefined = this.inputObservers[instanceInput.inputId];
          if (inputObservers == undefined) {
            this.inputObservers[instanceInput.inputId] = inputObservers = [];
          }
          inputObservers.push({instanceId: instance.id, argumentId})
        } else {
          const inputNode = this.nodeById(instanceInput.instanceId);
          inputNode.observers.push({instanceId: instance.id, argumentId,});
        }
      }
    }
  }

  private nodeById(instanceId: InstanceId) {
    const inputNodeIndex = this.nodesById.get(instanceId);
    if (inputNodeIndex === undefined) {
      throw `unknown input ${instanceId}`;
    }
    const inputNode = this.nodes[inputNodeIndex];
    return inputNode;
  }

  private childInputQuerier(parentInputQuerier: InputQuerier<Inputs>, instanceId: InstanceId): InputQuerier<{}> {
    const parent = this;
    const node = parent.nodeById(instanceId);
    return <R>(
        stack: Frame,
        inputKey: string,
        query: Query<ValueType, R>): R => {
      const instanceInput = parent.instanceInputForNode(node, inputKey);
      if (instanceInput.type === 'input') {
        return parentInputQuerier(pop(stack), instanceInput.inputId, query as any);
      } else {
        const inputNode = parent.nodeById(instanceInput.instanceId);
        const inputSelf = parent.dataForNode(stack, inputNode);
        return inputNode.instance.component.query(parent.childInputQuerier(parentInputQuerier, instanceInput.instanceId), inputSelf, stack, query);
      }
      };
  }

  private dataForNode(stack: Frame, inputNode: Node<Inputs>): {} | undefined {
    const compositeData = stack.value as CompositeData;
    return inputNode.frameKey === undefined ? undefined : compositeData[inputNode.frameKey];
  }

  private instanceInputForNode(node: Node<Inputs>, inputKey: string) {
    const instanceInput = node.instance.inputs.get(inputKey);
    if (instanceInput === undefined) {
      throw `Unexpected input key ${inputKey}`;
    }
    return instanceInput;
  }
}
