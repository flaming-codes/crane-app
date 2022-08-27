/**
 * Copy to the clipboard using the modern clipboard-API.
 *
 * @param source
 */
export function copyToClipboard(source: string, onSuccess: () => void) {
  try {
    if (navigator?.permissions?.query) {
      navigator.permissions
        // @ts-expect-error Invalid typing for 'name'.
        .query({ name: 'clipboard-write' })
        .then((result) => {
          if (result.state == 'granted' || result.state == 'prompt') {
            navigator.clipboard.writeText(source).then(onSuccess);
          }
        })
        .catch(() => {
          navigator.clipboard.writeText(source).then(onSuccess);
        });
    } else if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(source).then(onSuccess);
    }
  } catch (error) {
    console.error(error);
  }
}
