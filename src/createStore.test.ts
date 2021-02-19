import { createStore } from "./createStore";
import { strictEqual, deepStrictEqual } from "assert";

describe("createStore tests", () => {

  test("should update state on publish", async () => {
    const store = createStore(false);

    store.publish(true);

    strictEqual(store.getState(), true);
  });

  test("should update subscribers on publish", () => {
    let innerState = 1;
    const store = createStore(1);

    store.subscribe(s => innerState = s);

    store.publish(2);

    strictEqual(innerState, 2);
  });

  test("should not update unsubscribed subscribers on publish", () => {
    let innerState = 1;
    const store = createStore(1);

    const unsubscribe = store.subscribe(s => innerState = s);
    unsubscribe();

    store.publish(2);

    strictEqual(innerState, 1);
  });

  test("should not be able to mutate inner store state", () => {
    const store = createStore({ a: 1 });

    store.getState().a = 5;

    deepStrictEqual(store.getState(), { a: 1 });
  });

  test("should update subscribers by passing callback to publisher", () => {
    const store = createStore(1);
    let innerState = 1;

    store.subscribe(s => innerState = s);

    store.publish(s => ++s);

    deepStrictEqual(innerState, 2);
  });

});