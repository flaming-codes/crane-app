import { useNetworkConnectivity } from "@remix-pwa/client";
import { addSeconds } from "date-fns";
import { useRef } from "react";
import { toast } from "sonner";

/**
 * Show a toast when the network state changes.
 */
export function useNetworkStateToast(isEnabled = true) {
  // Threshold as the callbacks are called multiple times
  // on first load (no change event).
  const thresholdRef = useRef(addSeconds(new Date(), 2).getTime());

  useNetworkConnectivity({
    onOffline() {
      if (isEnabled && new Date().getTime() >= thresholdRef.current) {
        toast.dismiss("network-state-online");
        toast.warning("You are offline, loading of pages won't work", {
          id: "network-state-offline",
        });
      }
    },
    onOnline() {
      if (isEnabled && new Date().getTime() >= thresholdRef.current) {
        toast.dismiss("network-state-offline");
        toast.success("You are online, all pages are available", {
          id: "network-state-online",
        });
      }
    },
  });
}
