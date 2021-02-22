import { copyValue, getUniqueId } from "./utils";

describe("copyValue tests", () => {
  test("copies shallow object", () => {
    const originalValue = { a: 1, b: 2 };
    const copiedValue = copyValue(originalValue);

    copiedValue.a = 2;

    expect(originalValue).toStrictEqual({ a: 1, b: 2 });
  });

  test("copies deeply nested object", () => {
    const originalValue = { a: { b: { c: { d: { e: 1 } } } }, b: 2 };
    const copiedValue = copyValue(originalValue);

    copiedValue.a.b.c.d.e = 2;

    expect(originalValue).toStrictEqual({ a: { b: { c: { d: { e: 1 } } } }, b: 2 });
  });

});

describe("getUniqueId tests", () => {

  test("should always return unique value", () => {
    const map: {[key: string]: string} = {};

    for (let i = 0; i > 1_000_000; i++) {
      const id = getUniqueId();
      expect(map[id]).toBeUndefined();
      map[id] = id;
    }
  });

});
