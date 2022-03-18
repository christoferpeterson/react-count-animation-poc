import { useEffect, useState } from "react";

const ANIMATION_LENGTH_MS = 500;
const FRAMES = 30;
let interval;

export default function App() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(0);
  const debouncedTarget = useDebounce(target, ANIMATION_LENGTH_MS);

  useEffect(() => {
    if (typeof debouncedTarget === typeof 2) {
      clearInterval(interval);
      const difference = debouncedTarget - count;
      if (difference === 0) {
        return;
      }
      const ticks = ANIMATION_LENGTH_MS / FRAMES;
      const delta = difference / ticks;
      interval = setInterval(() => {
        setCount((currentCount) => {
          const newCount = (delta > 0 ? Math.ceil : Math.floor)(
            currentCount + delta
          );
          if (
            (newCount < debouncedTarget && delta < 0) ||
            (newCount > debouncedTarget && delta > 0)
          ) {
            clearInterval(interval);
            return debouncedTarget;
          }
          return newCount;
        });
      }, ticks);
    }
  }, [debouncedTarget]);

  return (
    <div className="App">
      <label>Enter new target value:</label>
      <input
        value={target}
        onChange={(e) => setTarget(+e.currentTarget.value)}
      />
      <p>Current Count: {count}</p>
    </div>
  );
}

// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
