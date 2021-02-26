import { clone, uid, isEqual } from "./utils";

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
  enableMutations: boolean,
  /**
   * By default Store will check published value if it's the same as it was before  
   * If the value is the same publish event will not happen and subscribers callbacks will not be run
   * 
   * default - `false`
   * */
  disableEqualityCheck: boolean
}

const defaultOptions: StoreOptions = {
  enableMutations: false,
  disableEqualityCheck: false
};

export const createStore = <T>(
  initialStore: T,
  options: Partial<StoreOptions> = defaultOptions
) => {
  const {
    enableMutations,
    disableEqualityCheck
  } = { ...defaultOptions, ...options };

  let store = initialStore;

  const subscribers: SubscribersHashMap<T> = {};

  const getState = () => enableMutations ? store : clone(store);

  const publish = (dataOrCb: T | PublisherCallback<T>) => {

    let value: T;
    if (typeof dataOrCb === "function") {
      value = (dataOrCb as PublisherCallback<T>)(getState());
    } else {
      value = dataOrCb;
    }

    if (disableEqualityCheck || !isEqual(store, value)) {
      store = value;

      for (const id in subscribers) subscribers[id](getState());
    }
  };

  const subscribe = (callback: SubscriberCallback<T>): Unsubscribe => {
    const id = uid();

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
