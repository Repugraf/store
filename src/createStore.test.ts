import { cloneDeep, isEqual } from "lodash";
import { createStore } from "./createStore";

describe("createStore tests", () => {

  test("should update state on publish", async () => {
    const store = createStore(false);

    store.publish(true);

    expect(store.getState()).toBe(true);
  });

  test("should update subscribers on publish", () => {
    let innerState = 1;
    const store = createStore(1);

    store.subscribe(s => innerState = s);

    store.publish(2);

    expect(innerState).toBe(2);
  });

  test("should not update unsubscribed subscribers on publish", () => {
    let innerState = 1;
    const store = createStore(1);

    const unsubscribe = store.subscribe(s => innerState = s);
    unsubscribe();

    store.publish(2);

    expect(innerState).toBe(1);
  });

  test("should not be able to mutate inner store state", () => {
    const store = createStore({ a: 1 });

    store.getState().a = 5;

    expect(store.getState()).toStrictEqual({ a: 1 })
  });

  test("should update subscribers by passing callback to publisher", () => {
    const store = createStore(1);
    let innerState = 1;

    store.subscribe(s => innerState = s);

    store.publish(s => ++s);

    expect(innerState).toBe(2);
  });

  test("amount of publish events should be equal to amount of subscribers", () => {
    const store = createStore(0);
    let events = 0;

    store.subscribe(() => events++);
    store.subscribe(() => events++);
    store.subscribe(() => events++);

    store.publish(1);

    expect(events).toBe(3);
  });

  test("there should be no publish events if there is no subscribers", () => {
    const store = createStore(0);
    let events = 0;

    store.publish(1);

    expect(events).toBe(0);
  });

  test("should be able to mutate inner store state if explicitly enabled", () => {
    const store = createStore({ x: 1 }, { cloneFunction: null });

    store.getState().x = 2;

    expect(store.getState()).toStrictEqual({ x: 2 });
  });

  test("should not publish if published primitive value is the same", () => {
    let publishEvents = 0;
    const store = createStore(0);

    store.subscribe(() => publishEvents++);

    store.publish(0);
    store.publish(0);
    store.publish(0);

    expect(publishEvents).toBe(0);
  });

  test("should not publish if published non-primitive value is the same", () => {
    let publishEvents = 0;
    const store = createStore({ a: 1, b: 2 });

    store.subscribe(() => publishEvents++);

    store.publish({ a: 1, b: 2 });
    store.publish({ a: 1, b: 2 });
    store.publish({ a: 1, b: 2 });

    expect(publishEvents).toBe(0);
  });

  test("should publish anyway if equality check is disabled", () => {
    let publishEvents = 0;
    const store = createStore(0, { isEqualFunction: null });

    store.subscribe(() => publishEvents++);

    store.publish(0);
    store.publish(0);
    store.publish(0);

    expect(publishEvents).toBe(3);
  });

  test("should throw if store contains invalid json properties", () => {
    // @ts-ignore
    const state = { a: 1n };
    // @ts-ignore
    state.state = state;

    expect(() => createStore(state)).toThrow();
  });

  test("should work with invalid json properties if custom clone and isEqual functions support it", () => {
    // @ts-ignore
    const state = { a: 1n };
    // @ts-ignore
    state.state = state;

    // @ts-ignore
    const expectedState = { a: 2n };
    // @ts-ignore
    expectedState.state = expectedState;

    const store = createStore(state, {
      cloneFunction: cloneDeep,
      isEqualFunction: isEqual
    });

    store.subscribe(() => {});

    store.publish(s => {
      s.a++;
      return s;
    });

    expect(store.getState()).toStrictEqual(expectedState);
  });

});