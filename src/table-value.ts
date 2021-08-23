import { MutableTableType, TableType } from "./table/index.js";
import { ValueType } from "./value-type.js";
import { Value } from "./value.js";

export class TableValue<T extends ValueType> extends Value<TableType<T>> {
  // TODO: map
  // TODO: reduce
  // TODO: filter
}

export class MutableTableValue<T extends ValueType> extends Value<MutableTableType<T>> {
}
