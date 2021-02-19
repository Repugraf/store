import { copyValue } from "./utils";

type Unsubscribe = () => void;
type SubscriberCallback<T> = (data: T) => any;
type SubscribersHashMap<T> = { [id: string]: SubscriberCallback<T> };

export const createStore = <T>(initialStore: T) => {
  let store = initialStore;

  const subscribers: SubscribersHashMap<T> = {};

  const getState = () => copyValue(store);

  const publish = (data: T) => {
    store = copyValue(data);

    for (const id in subscribers) subscribers[id](getState());
  };

  const subscribe = (callback: SubscriberCallback<T>): Unsubscribe => {
    const id = Math.random().toString(36).substr(2) + Date.now().toString(36);

    subscribers[id] = callback;

    return () => {
      delete subscribers[id];
    };
  };

  return {
    publish,
    subscribe,
    getState
  };
};

export default createStore;
