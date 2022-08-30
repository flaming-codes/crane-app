import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { store as searchStore } from './search';

export const store = {
  isInteractionEnabled: writable(true),
  isTrapped: writable(false)
};

/**
 * Side effect that attaches a once event listener to the document to
 * when the user moves the mouse when in trapped state.
 *
 * Allows consumers to disable certain interactions, e.g. hover of anchor,
 * which disabled the Chromium URL-bar. Else this bar would overlay the
 * search input when focused.
 */
export function disableInteractionOnFocusEffect() {
  const isInputFocused = get(searchStore.isInputFocused);
  const isTrapped = get(store.isTrapped);
  const isInteractionEnabled = get(store.isInteractionEnabled);

  if (browser && isInputFocused && isInteractionEnabled && !isTrapped) {
    store.isInteractionEnabled.set(false);
    store.isTrapped.set(true);

    document.addEventListener(
      'mousemove',
      () => {
        store.isInteractionEnabled.set(true);
      },
      { once: true }
    );
  }

  if (isTrapped && !isInputFocused) {
    store.isTrapped.set(false);
  }
}
