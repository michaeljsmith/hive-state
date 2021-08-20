import { expect } from "chai";
import { host, scalar } from "../index.js";

describe('hive/react', function() {
  it('evaluates trival block', function() {
    const accessor = host(() => scalar(3));
    expect(accessor.get()).equals(3);
    accessor.setter()(5);
    expect(accessor.get()).equals(5);
  });
});
