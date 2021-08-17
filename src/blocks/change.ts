export interface Change {
  __brand: 'Change';
}

export function brandAsChange<T>(value: T): T & Change {
  return value as T & Change;
}
