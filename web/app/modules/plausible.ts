/**
 * Log an analytics-event.
 *
 * @params Parameters for event request.
 */
export function sendEvent(
  ...params: Parameters<NonNullable<Window["plausible"]>>
) {
  if (window.ENV.isPlausibleEnabled) {
    try {
      window.plausible?.(...params);
    } catch (error) {
      console.error("Error sending analytics event", error);
    }
  }
}
