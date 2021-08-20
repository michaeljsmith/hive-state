import { expect } from "chai";
import { host, scalar } from "../index.js";

describe('hive/react', function() {
  it('evaluates trival block', function() {
    const accessor = host(() => scalar(3));
    expect(accessor.get()).equals(3);
    accessor.setter()(5);
    expect(accessor.get()).equals(5);
  });

  it('propagates change in trivial block', function() {
    const result = [0];
    const accessor = host(() => scalar(0), (change) => change({set(value) {result[0] = value;}}));
    accessor.setter()(2);
    expect(result[0]).equals(2);
  });
});
