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
### 1. Enabling mutations
By default every store access (returned value `getState` function, first parameter in subscriber and publisher callbacks) will be a copy of actual store to prevent direct store mutations.

This is fine in most cases but there might be a performance issue in this cases:

* Store is a deeply nested object or/and a lot of properties
* There are a lot of subscribers and publish events per events per second

Also if store contains not valid `JSON` properties (ES6 `Map` or `Set`, `BigInt`, functions, `undefined` values, cyclic values etc.) they will be deleted.

To fix this issues you can enable mutations. This option will force store to always return actual store and not a copy of it.

Usage:
```js
const initialStore = {
  a:
  {
    b:
    {
      c:
      {
        d: [
          {
            e: 1n,
            f: new Map(),
            g: new Set(),
            h: () => true,
            i: undefined
          }
        ]
      }
    }
  }
};

const store = createStore(initialStore, { enableMutations: true });

store.subscribe(data => console.log(data.a));
store.subscribe(data => console.log(data.a.b));
store.subscribe(data => console.log(data.a.b.c));
store.subscribe(data => console.log(data.a.b.c.d));
store.subscribe(data => console.log(data.a.b.c.d[0]));
store.subscribe(data => console.log(data.a.b.c.d[0].e));

setInterval(() => {
  store.publish(data => {
    data.a.b.c.d[0].e++;
    return data;
  });
}), 10);
```

### 2. Disable Equality Check
Store will not trigger publish event if published value is the same as before  
It's possible to disable this behavior by setting `disableEqualityCheck` to `true`
