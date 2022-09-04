/**
 * Log an analytics-event.
 *
 * @params Parameters for event request.
 */
export function sendEvent(...params: Parameters<NonNullable<Window['plausible']>>) {
  const releaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;

  if (releaseChannel === 'production') {
    try {
      window.plausible?.(...params);
    } catch (error) {
      console.error('Error sending analytics event', error);
    }
  }
}
