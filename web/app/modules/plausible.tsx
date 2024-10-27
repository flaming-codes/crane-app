import { useEffect, useState } from "react";
import { InfoPill } from "./info-pill";
import { ClientOnly } from "remix-utils/client-only";
import clsx from "clsx";

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

export function PlausibleChoicePillButton() {
  const [isEnabled, setIsEnabled] = useState(true);
  useEffect(() => {
    setIsEnabled(localStorage.plausible_ignore !== "true");
  }, []);

  const handleToggle = () => {
    const next = !isEnabled;
    localStorage.plausible_ignore = next ? "false" : "true";
    setIsEnabled(next);
  };

  return (
    <ClientOnly>
      {() => (
        <button
          onClick={handleToggle}
          className="animate-fade animate-duration-200"
        >
          <InfoPill
            label={<span className="text-gray-normal">Your choice</span>}
            variant="slate"
            className={clsx({
              "bg-gradient-to-br from-green-6 dark:from-green-10": isEnabled,
              "bg-gradient-to-br from-red-6 dark:from-red-10": !isEnabled,
            })}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </InfoPill>
        </button>
      )}
    </ClientOnly>
  );
}
