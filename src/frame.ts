export type FrameKey = number & {__brand: 'FrameKey'};

let nextFrameKeyNumber = 100;
export function newFrameKey(): FrameKey {
  return nextFrameKeyNumber++ as FrameKey;
}
