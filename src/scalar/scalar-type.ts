import { ValueTypeTemplate } from "../value-type.js";

export interface ScalarAccessor<T> {
  get(): T;
}

export interface MutableScalarAccessor<T> extends ScalarAccessor<T> {
  setter(): (value: T) => void;
}

export interface ScalarMutator<T> {
  set(value: T): T;
}

export type ScalarType<T> = ValueTypeTemplate<ScalarAccessor<T>, ScalarMutator<T>>;
export type MutableScalarType<T> = ValueTypeTemplate<ScalarAccessor<T>, ScalarMutator<T>>;
