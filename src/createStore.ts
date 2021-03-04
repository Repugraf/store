import type {
  Unsubscribe,
  PublisherCallback,
  SubscriberCallback,
  SubscribersHashMap,
  StoreOptions,
  Store
} from "./__types";

import { clone, isEqual } from "./utils";

const jsonStringifyDocsLink = "https://developer.mozilla.org/en-US" +
  "/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description";

const defaultOptions: StoreOptions = {
  cloneFunction: clone,
  isEqualFunction: isEqual
};

export const createStore = <T>(
  initialState: T,
  options: Partial<StoreOptions> = defaultOptions
): Store<T> => {
  const {
    cloneFunction,
    isEqualFunction
  } = { ...defaultOptions, ...options };

  let state = initialState;

  const subscribers: SubscribersHashMap<T> = {};

  const getState = () => {
    let value: T;

    try {
      value = cloneFunction ? cloneFunction(state) : state;
    } catch (e) {
      const errMessage = e.message;

      e.message = "clone function crashed\n";

      if (options.cloneFunction === undefined) e.message += (
        "Don't use invalid json properties in store or provide custom clone function" +
        `\nRead more info here: ${jsonStringifyDocsLink}\n`
      );
      else e.message += (
        "Provide custom clone function to fix this issue\n"
      );

      e.message += errMessage;

      throw e;
    }

    return value;
  };

  const publish = (dataOrCb: T | PublisherCallback<T>) => {

    let value: T;
    if (typeof dataOrCb === "function") {
      value = (dataOrCb as PublisherCallback<T>)(getState());
    } else {
      value = dataOrCb;
    }

    let equal: boolean;

    try {
      equal = !!isEqualFunction?.(state, value);
    } catch (e) {
      const errMessage = e.message;

      e.message = "isEqual function crashed\n";

      if (options.isEqualFunction === undefined) e.message += (
        "Don't use invalid json properties in store or provide custom isEqual function" +
        `\nRead more info here: ${jsonStringifyDocsLink}\n`
      );
      else e.message += (
        "Provide custom isEqual function to fix this issue\n"
      );

      e.message += errMessage;

      throw e;
    }

    if (!equal) {
      state = value;
    
      const subscribersKeys = Reflect.ownKeys(subscribers) as any[];
      for (const id of subscribersKeys) subscribers[id](getState());
    }
  };

  const subscribe = (callback: SubscriberCallback<T>): Unsubscribe => {
    const id = Symbol("id") as any;

    subscribers[id] = callback;

    return () => {
      delete subscribers[id];
    };
  };

  getState(), isEqualFunction?.(state, state); // validate state

  return {
    publish,
    subscribe,
    getState
  };
};

export default createStore;
