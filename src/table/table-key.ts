export type TableKey = string & {__brand: "TableKey"};

export function asTableKey(key: string): TableKey {
  return key as TableKey;
}
