# Store

This is easy to use implementation of observer pattern.
It can be used in frontend and backend applications.

It differs from other similar libraries because there is no need to use reducers or complex setup with actions. Also it's very light, doesn't have any dependencies and doesn't force any type of programing on you (object oriented, function oriented).

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