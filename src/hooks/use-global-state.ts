import { useState, useEffect } from "react";

const GLOBAL_STATE = new Map<string, unknown>();

/**
 * Creates a global state hook that can be used to share state between components
 *
 * @param key - The key to use for the global state
 * @returns A hook that can be used to get and set the global state, and reset it
 */
export function createGlobalState<T>(key: string) {
  const useGlobalState = <D extends T>() => {
    const [state, setState] = useState<D>(GLOBAL_STATE.get(key) as D);

    useEffect(() => {
      GLOBAL_STATE.set(key, state);
    }, [state]);

    const reset = () => GLOBAL_STATE.delete(key);

    return [state, setState, reset] as const;
  };

  return useGlobalState;
}
