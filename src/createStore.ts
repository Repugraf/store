import { copyValue, getUniqueId } from "./utils.js";

type Unsubscribe = () => void;
type PublisherCallback<T> = (data: T) => T;
type SubscriberCallback<T> = (data: T) => any;
type SubscribersHashMap<T> = { [id: string]: SubscriberCallback<T> };

interface StoreOptions {
  /**
   * If enabled every store access will return actual value instead of a copy  
   * This may break the workflow - store should change only from publish events  
   * But copy of deeply nested objects every access may cause performance issues
   * 
   * default - `false`
   * */
  enableMutations: boolean
}

const defaultOptions: StoreOptions = {
  enableMutations: false
};

export const createStore = <T>(
  initialStore: T,
  options: Partial<StoreOptions> = defaultOptions
) => {
  const { enableMutations } = { ...defaultOptions, ...options };

  let store = initialStore;

  const subscribers: SubscribersHashMap<T> = {};

  const getState = () => enableMutations ? store : copyValue(store);

  const publish = (dataOrCb: T | PublisherCallback<T>) => {

    let value: T;
    if (typeof dataOrCb === "function") {
      value = (dataOrCb as PublisherCallback<T>)(getState());
    } else {
      value = dataOrCb;
    }

    store = value;

    for (const id in subscribers) subscribers[id](getState());
  };

  const subscribe = (callback: SubscriberCallback<T>): Unsubscribe => {
    const id = getUniqueId();

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
