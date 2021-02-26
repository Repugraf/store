# Store

This is easy to use implementation of observer pattern.
It can be used in frontend and backend applications.

It differs from other similar libraries because there is no need to use reducers or complex setup with actions. Also it's very light, doesn't have any dependencies and doesn't force any type of programing on you (object oriented, function oriented).
***
Basic example
```js
const store = createStore("");

store.subscribe(message => console.log(message));

store.publish("Hello from publisher");
```

Usage with React
```jsx
const counterStore = createStore(0);

const increment = () => counterStore.publish(s => ++s);
const decrement = () => counterStore.publish(s => --s);

const useCounterStore = () => {
  const [state, setState] = useState(counterStore.getState());

  useEffect(() => store.subscribe(data => setState(data)), []);

  return state;
}

const CountDisplay = () => {
  const count = useCounterStore();

  return (
    <p>{count}</p>
  );
}

const CountControls = () => (
  <>
    <button onClick={increment}>increment</button>
    <button onClick={decrement}>decrement</button>
  </>
);

const Counter = () => (
  <>
    <CountDisplay/>
    <CountControls/>
  </>
);
```
***
## Options
### 1. `cloneFunction`
The Store is using inner function to clone values

To not use external libraries and be fast it uses
`JSON.parse(JSON.stringify(value))` on not primitive values

This is fine for json-like data but will fail on when there is one of not valid json values:
`BigInt`, `Set`, `WeakSet`, `Map`, `WeakMap`, functions, `Symbol` cyclic values

To be able to use this values there inside store provide custom clone function
or disable cloning by setting `cloneFunction` to `null`
(not recommended - will allow to mutate inner store state)

Read more about `JSON.stringify` limitations
[here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description)

```js
import { cloneDeep } from "lodash";

const store = createStore({ a: 1n, s: new Set() }, { cloneFunction: cloneDeep });
```

### 2. `isEqualFunction`
On publish event the Store will check previous state for changes

If there wasn't any - store will block running subscribers callbacks

You can provide your custom isEqual function or set it to `null` to always run subscribers callbacks
even is store remains unchanged

```js
import { isEqual } from "lodash";

const store = createStore({ a: 1n, s: new Set() }, { isEqualFunction: isEqual });
```
