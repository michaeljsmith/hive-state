import { InputQuerier } from "./input-querier.js";
import { Node, NodeFactory } from "./node";
import { FrameKey, newFrameKey } from "./frame-key.js";
import { InstanceId } from "./instance-id";
import { Frame, pop, push } from "./stack.js";
import { Change, Query, ValueType } from "./value-type.js";
import { BindingId, lookupBinding, Scope } from "./scope.js";

export type InstanceInput =
  { type: 'input', inputId: string } |
  { type: 'instance', instanceId: InstanceId };

export type Instance = {
  id: InstanceId;
  nodeFactory: NodeFactory<{}, ValueType>;
  inputs: Map<string, BindingId>;
};

type CompositeData = {
  [key: string]: {};
};

export class Composite<Inputs extends {}, O extends ValueType> {
  private instances: Instance[];
  private nodesById: Map<number, number>;
  private outputSpecifier: BindingId;
  private scope: Scope;

  constructor(scope: Scope, outputSpecifier: BindingId) {
    this.instances = scope.instances;
    this.nodesById = new Map(scope.instances.map((instance, i) => [instance.id, i]));
    this.outputSpecifier = outputSpecifier;
    this.scope = scope;
  }

  createNode(inputQuerier: InputQuerier<Inputs>): Node<Inputs, O> {
    const parent = this;
    interface ChildNode {
      node: Node<{}, ValueType>,
      instance: Instance,
      frameKey: FrameKey | undefined,
    }
    const childNodes: ChildNode[] = this.instances.map((instance) => {
      const childNode = instance.nodeFactory(childInputQuerier(inputQuerier, instance.id));
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
        const inputBinding = parent.inputBindingForNode(node, inputKey);
        return childQuery(parentInputQuerier, inputBinding, stack, query);
      };
    }

    function childQuery<R>(parentInputQuerier: InputQuerier<Inputs>, bindingId: BindingId, stack: Frame, query: Query<ValueType, R>): R {
      const instanceInput = lookupBinding(parent.scope, bindingId);
      if (instanceInput.type === 'input') {
        return parentInputQuerier(pop(stack), instanceInput.inputId as keyof Inputs, query as any);
      } else {
        const inputNodeIndex = parent.nodeIndexById(instanceInput.instanceId);
        const inputNode = childNodes[inputNodeIndex];
        const inputSelf = dataForNode(stack, inputNode);
        return inputNode.node.query(inputSelf, stack, query);
      }
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
          for (const [argumentId, bindingId] of child.instance.inputs) {
            const instanceInput = lookupBinding(parent.scope, bindingId);
            if (instanceInput.type === 'input') {
              childChanges[argumentId] = changes[instanceInput.inputId as keyof Inputs] as Change<ValueType>;
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
        const output = lookupBinding(parent.scope, parent.outputSpecifier);
        if (output.type === 'input') {
          return changes[output.inputId as keyof Inputs] as Change<ValueType>;
        } else {
          const outputNodeIndex = parent.nodeIndexById(output.instanceId);
          return changeForNode[outputNodeIndex];
        }
      },

      query<R>(self: unknown, stack: Frame, query: Query<O, R>): R {
        return childQuery(inputQuerier, parent.outputSpecifier, stack, query);
      },
    };
  }

  private nodeById(instanceId: InstanceId): Instance {
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

  private inputBindingForNode(node: Instance, inputKey: string): BindingId {
    const inputBinding = node.inputs.get(inputKey);
    if (inputBinding === undefined) {
      throw `Unexpected input key ${inputKey}`;
    }
    return inputBinding;
  }
}
