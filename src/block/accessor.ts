export interface Accessor {
  __brand: 'accessor';
}

export function brandAsAccessor<T extends Accessor>(value: Omit<T, '__brand'>): T {
  return value as T & Accessor;
}
