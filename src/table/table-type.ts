import { Accessor } from "../block/accessor.js";
import { AccessorFor, ChangeFor, ValueType, ValueTypeTemplate } from "../value-type.js";
import { TableKey } from "./table-key.js";

export interface TableEntryAccessor<T extends ValueType> {
  key: TableKey;
  accessor: AccessorFor<T>;
}

export interface TableAccessor<T extends ValueType> extends Accessor {
  get(key: TableKey): AccessorFor<T>;
  entries(): IterableIterator<TableEntryAccessor<T>>;
}

export interface MutableTableAccessor<T extends ValueType> extends TableAccessor<T> {
  // TODO: Provide direct mutation functions, rather than returning functions.
  // TODO: Rename Accessor interfaces to simply be the table.
  // TODO: Allow entries to be initialized before they become reactive.
  inserter(): (nextKey: TableKey | null) => TableKey;
  deleter(): (key: TableKey) => void;
  clearer(): () => void;
}

export interface TableMutator<T extends ValueType> {
  insert(key: TableKey): void;
  delete(key: TableKey): void;
  clear(): void;
  mutate(key: TableKey, change: ChangeFor<T>): void;
}

export type TableType<T extends ValueType> = ValueTypeTemplate<TableAccessor<T>, TableMutator<T>>;
export type MutableTableType<T extends ValueType> = ValueTypeTemplate<MutableTableAccessor<T>, TableMutator<T>>;
