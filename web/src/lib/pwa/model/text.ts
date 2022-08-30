import { getHostOS } from './agent';

let metaKey: string | undefined;

/**
 *
 * @param source
 * @returns
 */
export function platformString(source: string) {
  if (!metaKey) {
    const host = getHostOS();
    metaKey = host === 'mac' ? '⌘' : 'Ctrl';
  }

  return source
    .replace(/:meta:/g, metaKey)
    .replace(/:shift:/g, '⇧')
    .replace(/:enter:/g, '⏎')
    .replace(/:tab:/g, '⇥')
    .replace(/:backspace:/g, '⌫')
    .replace(/:delete:/g, '⌦')
    .replace(/:up:/g, '↑')
    .replace(/:down:/g, '↓')
    .replace(/:left:/g, '←')
    .replace(/:right:/g, '→')
    .replace(/:space:/g, '␣')
    .replace(/:esc:/g, '⎋');
}
