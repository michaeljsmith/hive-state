export type FrameKey = number & {__brand: 'FrameKey'};

export interface Frame {
  get(key: FrameKey): unknown;
}

let nextFrameKeyNumber = 100;
export function newFrameKey(): FrameKey {
  return nextFrameKeyNumber++ as FrameKey;
}
