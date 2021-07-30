export type FrameKey = number & {__brand: 'FrameKey'};

export interface Frame {
  get(key: FrameKey): unknown;
  set(key: FrameKey, value: unknown): void;

  newChild(): Frame;
}

export interface FrameMap {
  [key: number]: unknown;
}

class FrameImpl implements Frame {
  private frameMap: FrameMap;

  constructor(frameMap: FrameMap) {
    this.frameMap = frameMap;
  }

  get(key: FrameKey): unknown {
    return this.frameMap[key];
  }

  set(key: FrameKey, value: unknown): void {
    this.frameMap[key] = value;
  }

  newChild(): Frame {
    const childFrameMap = Object.create(this.frameMap);
    return new FrameImpl(childFrameMap);
  }
}

export function newRootFrame() {
  return new FrameImpl({});
}

let nextFrameKeyNumber = 100;
export function newFrameKey(): FrameKey {
  return nextFrameKeyNumber++ as FrameKey;
}
