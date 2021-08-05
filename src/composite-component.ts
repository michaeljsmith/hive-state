import { InputQuerier, Node } from "./component.js";
import { FrameKey, newFrameKey } from "./frame-key.js";
import { InstanceId } from "./instance-id";
import { Frame, pop, push } from "./stack.js";
import { Change, Query, ValueType } from "./value-type.js";

export type InstanceInput<Inputs extends {}> =
  { type: 'input', inputId: keyof Inputs } |
  { type: 'instance', instanceId: InstanceId };

// TODO: Get rid of this.
export type Instance<Inputs extends {}> = {
  id: InstanceId;
  component: (inputQuerier: InputQuerier<{}>) => Node<{}, ValueType>;
  inputs: Map<string, InstanceInput<Inputs>>;
};

type CompositeData = {
  [key: string]: {};
};

export class CompositeComponent<Inputs extends {}, O extends ValueType> {
  private instances: Instance<Inputs>[];
  private nodesById: Map<number, number>;
  private outputNodeId: InstanceId;

  constructor(instances: Instance<Inputs>[]) {
    this.instances = instances;
    this.nodesById = new Map(instances.map((instance, i) => [instance.id, i]));
    this.outputNodeId = instances[instances.length - 1].id;
  }

  createNode(inputQuerier: InputQuerier<Inputs>): Node<Inputs, O> {
    const parent = this;
    interface ChildNode {
      node: Node<{}, ValueType>,
      instance: Instance<Inputs>,
      frameKey: FrameKey | undefined,
    }
    const childNodes: ChildNode[] = this.instances.map((instance) => {
      const childNode = instance.component(childInputQuerier(inputQuerier, instance.id));
      return {
        node: childNode,
        instance,
        frameKey: childNode.construct === undefined ? undefined : newFrameKey(),
      };
    });

    function childInputQuerier(parentInputQuerier: InputQuerier<Inputs>, instanceId: InstanceId): InputQuerier<{}> {
      const node = parent.nodeById(instanceId);
      return <R>(
          stack: Frame,
          inputKey: string,
          query: Query<ValueType, R>): R => {
        const instanceInput = parent.instanceInputForNode(node, inputKey);
        if (instanceInput.type === 'input') {
          return parentInputQuerier(pop(stack), instanceInput.inputId, query as any);
        } else {
          const inputNodeIndex = parent.nodeIndexById(instanceInput.instanceId);
          const inputNode = childNodes[inputNodeIndex];
          const inputSelf = dataForNode(stack, inputNode);
          return inputNode.node.query(inputSelf, stack, query);
        }
      };
    }

    function dataForNode(stack: Frame, inputNode: ChildNode): {} | undefined {
      const compositeData = stack.value as CompositeData;
      return inputNode.frameKey === undefined ? undefined : compositeData[inputNode.frameKey];
    }
  
    return {
      construct(stack: Frame): {} {
        const self: CompositeData = {};
        const newStack = push(stack, self);
        for (const child of childNodes) {
          if (child.frameKey !== undefined && child.node.construct !== undefined) {
            self[child.frameKey] = child.node.construct(newStack);
          }
        }
        return self;
      },

      update(
          self: unknown,
          stack: Frame,
          changes: {[K in keyof Inputs]?: Inputs[K] extends ValueType ? Change<Inputs[K]> : never})
      : Change<O> {
        const selfData = self as CompositeData;
        const newStack = push(stack, self);

        const changeForNode: Change<ValueType>[] = [];

        // Update each node in construction order.
        for (let i = 0; i < childNodes.length; ++i) {
          const child = childNodes[i];

          // Assemble the changes to pass to the child.
          const childChanges: {[key: string]: Change<ValueType>} = {};
          for (const [argumentId, instanceInput] of child.instance.inputs) {
            if (instanceInput.type === 'input') {
              childChanges[argumentId] = changes[instanceInput.inputId] as Change<ValueType>;
            } else {
              const inputNodeIndex = parent.nodeIndexById(instanceInput.instanceId);
              if (inputNodeIndex >= i) {
                throw 'invalid input id';
              }
              childChanges[argumentId] = changeForNode[inputNodeIndex];
            }
          }

          // Update the child node.
          const childSelf = child.frameKey === undefined ? undefined : selfData[child.frameKey];
          changeForNode[i] = child.node.update(childSelf, newStack, childChanges);
        }

        // Return the changes from the output node.
        const outputNodeIndex = parent.outputNodeIndex();
        return changeForNode[outputNodeIndex];
      },

      query<R>(self: unknown, stack: Frame, query: Query<O, R>): R {
        const outputNodeIndex = parent.outputNodeIndex();
        const outputNode = childNodes[outputNodeIndex];
        const selfData = self as CompositeData;
        const childSelf = outputNode.frameKey === undefined ? undefined : selfData[outputNode.frameKey];
        return outputNode.node.query(childSelf, push(stack, self), query);
      },
    };
  }

  private outputNodeIndex() {
    const outputNodeIndex = this.nodesById.get(this.outputNodeId);
    if (outputNodeIndex === undefined) {
      throw 'unknown output node';
    }
    return outputNodeIndex;
  }

  private nodeById(instanceId: InstanceId): Instance<Inputs> {
    const inputNodeIndex = this.nodeIndexById(instanceId);
    const inputNode = this.instances[inputNodeIndex];
    return inputNode;
  }

  private nodeIndexById(instanceId: InstanceId): number {
    const inputNodeIndex = this.nodesById.get(instanceId);
    if (inputNodeIndex === undefined) {
      throw `unknown input ${instanceId}`;
    }
    return inputNodeIndex;
  }

  private instanceInputForNode(node: Instance<Inputs>, inputKey: string) {
    const instanceInput = node.inputs.get(inputKey);
    if (instanceInput === undefined) {
      throw `Unexpected input key ${inputKey}`;
    }
    return instanceInput;
  }
}
