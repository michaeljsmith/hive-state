export interface ValueTypeTemplate<Accessor, Mutator> {
  __MARKER_VALUE: true; // TODO: Refine this.
  __QUERY_BRANDING: Accessor;
  __CHANGE_BRANDING: Mutator;
}

export type ValueType = ValueTypeTemplate<unknown, unknown>;

export type Accessor<V extends ValueType> =
  V extends ValueTypeTemplate<infer A, unknown> ? A : never;

export type Mutator<V extends ValueType> =
  V extends ValueTypeTemplate<unknown, infer M> ? M : never;

export type Query<V extends ValueType, R> = (accessor: Accessor<V>) => R;

export type Change<V extends ValueType> = (mutator: Mutator<V>) => void;
