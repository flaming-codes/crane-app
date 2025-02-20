import { useEffect, useState } from "react";
import { InfoPill } from "./info-pill";
import { ClientOnly } from "remix-utils/client-only";
import { clsx } from "clsx";
import { clog } from "./observability";

/**
 * Log an analytics-event.
 *
 * @params Parameters for event request.
 */
export function sendEvent(
  ...params: Parameters<NonNullable<Window["plausible"]>>
) {
  if (
    window.ENV.isPlausibleEnabled &&
    localStorage.getItem("plausible_ignore") !== "true"
  ) {
    try {
      window.plausible?.(...params);
    } catch (error) {
      clog.error("Error sending analytics event", error);
    }
  }
}

export function PlausibleChoicePillButton() {
  const [isEnabled, setIsEnabled] = useState(true);
  useEffect(() => {
    setIsEnabled(localStorage.getItem("plausible_ignore") !== "true");
  }, []);

  const handleToggle = () => {
    const next = !isEnabled;
    localStorage.setItem("plausible_ignore", next ? "" : "true");
    setIsEnabled(next);
  };

  return (
    <ClientOnly>
      {() => (
        <button onClick={handleToggle} className="animate-fade duration-200">
          <InfoPill
            label={<span className="text-gray-normal">Your choice</span>}
            variant="slate"
            className={clsx("cursor-pointer", {
              "from-jade-6 dark:from-jade-11 bg-linear-to-br": isEnabled,
              "from-ruby-6 dark:from-ruby-10 bg-linear-to-br": !isEnabled,
            })}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </InfoPill>
        </button>
      )}
    </ClientOnly>
  );
}
