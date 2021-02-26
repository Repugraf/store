export type Unsubscribe = () => void;
export type PublisherCallback<T> = (data: T) => T;
export type SubscriberCallback<T> = (data: T) => any;
export type SubscribersHashMap<T> = { [id: string]: SubscriberCallback<T> };

export interface StoreOptions {
  /**
   * The Store is using inner function to clone values
   * 
   * To not use external libraries and be fast it uses
   * `JSON.parse(JSON.stringify(value))` on not primitive values
   * 
   * This is fine for json-like data but will fail on when there is one not valid json values:
   * `BigInt`, `Set`, `WeakSet`, `Map`, `WeakMap`, functions, `Symbol` cyclic values
   * 
   * To be able to use this values there inside store provide custom clone function
   * or disable cloning by setting `cloneFunction` to `null`
   * (not recommended - will allow to mutate inner store state)
   * 
   * Read more about `JSON.stringify` limitations
   * [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description)
   * 
   * ```js
   * import { cloneDeep } from "lodash";
   *
   * const store = createStore({ a: 1n, s: new Set() }, { cloneFunction: cloneDeep });
   * ```
   */
  cloneFunction: (<T>(value: T) => T) | null,
  /**
   * On publish event the Store will check previous state for changes
   * 
   * If there wasn't any - store will block running subscribers callbacks
   * 
   * You can provide your custom isEqual function or set it to `null` to always run subscribers callbacks
   * even is store remains unchanged
   * 
   * ```js
   * import { isEqual } from "lodash";
   * 
   * const store = createStore({ a: 1n, s: new Set() }, { isEqualFunction: isEqual });
   * ```
   */
  isEqualFunction: (<T>(firstVal: T, secondVal: T) => boolean) | null
}
