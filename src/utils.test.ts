import { deepStrictEqual } from "assert";
import { copyValue } from "./utils";

describe("copyValue tests", () => {
  test("copies shallow object", () => {
    const originalValue = { a: 1, b: 2 };
    const copiedValue = copyValue(originalValue);

    copiedValue.a = 2;

    deepStrictEqual(originalValue, { a: 1, b: 2 });
  });

  test("copies deeply nested object", () => {
    const originalValue = { a: { b: { c: { d: { e: 1 } } } }, b: 2 };
    const copiedValue = copyValue(originalValue);

    copiedValue.a.b.c.d.e = 2;

    deepStrictEqual(originalValue, { a: { b: { c: { d: { e: 1 } } } }, b: 2 });
  });

});

