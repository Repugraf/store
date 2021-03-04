import { isPrimitive, clone, isEqual } from "./utils";

describe("clone tests", () => {
  test("clones shallow object", () => {
    const originalValue = { a: 1, b: 2 };
    const copiedValue = clone(originalValue);

    copiedValue.a = 2;

    expect(originalValue).toStrictEqual({ a: 1, b: 2 });
  });

  test("clones deeply nested object", () => {
    const originalValue = { a: { b: { c: { d: { e: 1 } } } }, b: 2 };
    const copiedValue = clone(originalValue);

    copiedValue.a.b.c.d.e = 2;

    expect(originalValue).toStrictEqual({ a: { b: { c: { d: { e: 1 } } } }, b: 2 });
  });

});

describe("isPrimitive tests", () => {
  test("1 is a primitive", () => expect(isPrimitive(1)).toBe(true));

  test("null is a primitive", () => expect(isPrimitive(null)).toBe(true));

  test("object is not a primitive", () => expect(isPrimitive({})).toBe(false));

  test("array is not a primitive", () => expect(isPrimitive([])).toBe(false));

  test("undefined is a primitive", () => expect(isPrimitive(undefined)).toBe(true));

  test("empty string is a primitive", () => expect(isPrimitive("")).toBe(true));
});

describe("isEqual tests", () => {
  test("1 is not equal to 0", () => expect(isEqual(1, 0)).toBe(false));

  test("{} is equal to {}", () => expect(isEqual({}, {})).toBe(true));

  test("{} is not equal to []", () => expect(isEqual({}, [])).toBe(false));

  test("{} is not equal to { a:1 }", () => expect(isEqual({}, { a: 1 })).toBe(false));

  test("null is not equal to {}", () => expect(isEqual(null, {})).toBe(false));
});
