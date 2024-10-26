import { useEffect } from "react";

export function useKeyboardEvent(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options?: AddEventListenerOptions,
) {
  useEffect(() => {
    function handleEvent(event: KeyboardEvent) {
      if (event.key === key) {
        callback(event);
      }
    }

    window.addEventListener("keydown", handleEvent, options);

    return () => {
      window.removeEventListener("keydown", handleEvent, options);
    };
  }, [key, callback, options]);
}
