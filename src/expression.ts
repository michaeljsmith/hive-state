import { FrameKey } from "./frame-key.js";
import { Frame } from "./frame.js";

export type LiteralExpression<T> = {
  expressionType: 'literal';
  value: T;
};

export type ReferenceExpression<T> = {
  __typeBranding: T;
  expressionType: 'reference';
  key: FrameKey;
};

export type Lambda<T, Args extends unknown[]> = {
  __argBranding: Args;
  argKeys: {[K in keyof Args]: FrameKey};
  expression: Expression<T>;
  frame: Frame;
}

export type LambdaExpression<T, Args extends unknown[]> = {
  __argBranding: Args;
  expressionType: 'lambda';
  argKeys: {[K in keyof Args]: FrameKey};
  expression: Expression<T>;
};

export type CallExpression<T> = {
  expressionType: 'call';
  visit: <U>(
      visitor: <Args extends unknown[]>(
          lambda: Expression<Lambda<T, Args>>,
          args: {[K in keyof Args]: Expression<K>})
        => U)
    => U;
}

export type Expression<T> =
  LiteralExpression<T> |
  ReferenceExpression<T> |
  T extends Lambda<infer TL, infer Args> ? LambdaExpression<TL, Args> : never |
  CallExpression<T>;
