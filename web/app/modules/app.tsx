import { useEffect } from "react";

export const BASE_URL = "https://cran-e.com";

export const IS_SERVER = typeof window === "undefined";

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

export function useKeyboardShortcut(
  keyCombination: string,
  callback: () => void,
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = keyCombination.toLowerCase().split("+");
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdKey = isMac ? event.metaKey : event.ctrlKey;
      const ctrlKey = isMac ? event.ctrlKey : event.metaKey;
      const key = event.key.toLowerCase();

      const cmdMatch = keys.includes("cmd") && cmdKey;
      const ctrlMatch = keys.includes("ctrl") && ctrlKey;
      const keyMatch = keys.includes(key);

      if ((cmdMatch || ctrlMatch) && keyMatch) {
        event.stopPropagation();
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, keyCombination]);
}
