import { ValueTypeTemplate } from "./value-type.js";

export interface ScalarAccessor<T> {
  get(): T;
}

export interface ScalarMutator<T> {
  set(value: T): void;
}

export interface ScalarType<T> extends ValueTypeTemplate<ScalarAccessor<T>, ScalarMutator<T>> {}
