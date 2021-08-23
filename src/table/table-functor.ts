import { BlockData } from "../block/block.js";
import { ArgumentId, asArgumentId, Block, brandAsAccessor, Change, constructBlock, enclosureArgumentId, Functor, LambdaChange, NodeContext } from "../block/index.js";
import { nodeAccessor } from "../block/node-accessor.js";
import { propagateChanges } from "../block/propagate-changes.js";
import { AccessorFor, ChangeFor, ValueType } from "../value-type.js";
import { keyBetween } from "./key-between.js";
import { TableKey } from "./table-key.js";
import { MutableTableAccessor, TableType } from "./table-type.js";

export const elementArgumentId = asArgumentId("element");

interface TableEntry {
  key: TableKey;
  data: BlockData;
}

interface TableData {
  context: NodeContext;
  entries: TableEntry[];
}

export class TableFunctor<T extends ValueType> implements Functor {
  block: Block;

  constructor(block: Block) {
    this.block = block;
  }

  construct(context: NodeContext): {} | undefined {
    const data: TableData = {
      context, 
      entries: [],
    };
    return data;
  }

  // TODO: Extract framework for managing a lambda so it can be re-used for map/filter etc.
  handleArgumentChanges(data: {} | undefined, _context: NodeContext, argumentChanges: Map<ArgumentId, Change>): Change | undefined {
    const tableData = data as TableData | undefined;
    if (tableData === undefined) {
      throw 'Missing data';
    }

    const elementChanges: (Change | undefined)[] = new Array(tableData.entries.length);

    let changeFound = false;
    const elementArgumentChange = argumentChanges.get(elementArgumentId) as LambdaChange | undefined;
    if (elementArgumentChange !== undefined) {
      // A captured variable referenced by the element lambda has changed - propagate it to each element.
      for (const [i, entry] of tableData.entries.entries()) {
        const change = propagateChanges(this.block, entry.data, new Map(), elementArgumentChange.nodeChanges);
        elementChanges[i] = change;
        if (change !== undefined) {
          changeFound = true;
        }
      }
    }

    if (changeFound) {
      const change: ChangeFor<TableType<T>> = (mutator) => {
        for (const [i, change] of elementChanges.entries()) {
          const entry = tableData.entries[i];
          if (change !== undefined) {
            mutator.mutate(entry.key, change as ChangeFor<T>);
          }
        }
      }

      return change;
    }
  }

  accessor(data: {} | undefined, context: NodeContext): MutableTableAccessor<T> {
    const tableData = data as TableData | undefined;
    if (tableData === undefined) {
      throw 'Missing data';
    }

    const self = this;
    return brandAsAccessor<MutableTableAccessor<T>>({
      get(key) {
        const accessor: AccessorFor<T> = nodeAccessor(
          self.block, findElementData(key, tableData), self.block.outputNodeId) as AccessorFor<T>;
        return accessor;
      },

      entries() {
        return function*() {
          for (const {key, data} of tableData.entries) {
            yield {
              key,
              accessor: nodeAccessor(self.block, data, self.block.outputNodeId) as AccessorFor<T>,
            };
          }
        }();
      },

      inserter() {
        return (nextKey: TableKey | null) => {
          // Add the new entry.
          const position = nextKey === null ? tableData.entries.length : findElement(nextKey, tableData);
          const previousKey = position === 0 ? null : tableData.entries[position - 1].key;
          const newKey = keyBetween(previousKey, nextKey);
          const newBlockData = constructBlock(self.block, {
            argumentAccessor(argumentId) {
              // Check whether the element wants to access the enclosure (
              // e.g. to reference a captured variable).
              if (argumentId === enclosureArgumentId) {
                return context.argumentAccessor(elementArgumentId);
              }
              throw 'unexpected accessor call';
            },

            handleOutputChange(change) {
              const tableChange: ChangeFor<TableType<T>> = (mutator) => {
                mutator.mutate(newKey, change as ChangeFor<T>);
              }

              tableData.context.handleOutputChange(tableChange);
            },
          });
          tableData.entries.splice(position, 0, {
            key: newKey,
            data: newBlockData,
          });

          // Propagate the change.
          const change: ChangeFor<TableType<T>> = (mutator) => {
            mutator.insert(newKey);
          };
          tableData.context.handleOutputChange(change);

          return newKey;
        };
      },

      deleter() {
        return (key: TableKey) => {
          const position = findElement(key, tableData);
          tableData.entries.splice(position, 1);

          const change: ChangeFor<TableType<T>> = (mutator) => {
            mutator.delete(key);
          }
          tableData.context.handleOutputChange(change);
        };
      },

      clearer() {
        return () => {
          tableData.entries.splice(0, tableData.entries.length);
          const change: ChangeFor<TableType<T>> = (mutator) => {
            mutator.clear();
          }
          tableData.context.handleOutputChange(change);
        }
      },
    });
  }
}

function findElement(key: TableKey, tableData: TableData): number {
  // Binary search.
  let windowStart = 0;
  let windowEnd = tableData.entries.length;

  while (windowEnd - windowStart > 1) {
    const windowMiddle = (windowStart + windowEnd) / 2 >> 0;
    if (tableData.entries[windowMiddle].key > key) {
      windowEnd = windowMiddle;
    } else {
      windowStart = windowMiddle;
    }
  }

  if (tableData.entries[windowStart].key !== key) {
    throw 'item not found';
  }

  return windowStart;
}

function findElementData(key: TableKey, tableData: TableData): BlockData {
  return tableData.entries[findElement(key, tableData)].data;
}
