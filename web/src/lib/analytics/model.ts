/**
 * Log an analytics-event.
 *
 * @params Parameters for event request.
 */
export function sendEvent(params: Parameters<NonNullable<Window['pa']>['track']>[0]) {
  const releaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;

  if (releaseChannel === 'production') {
    window.pa?.track(params);
  }
}
