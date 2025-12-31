import arcjet, {
  type ArcjetDecision,
  type ArcjetReactRouterRequest,
  shield,
  tokenBucket,
} from "@arcjet/react-router";
import { ENV } from "../data/env";

const arcjetClient = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      interval: "10s",
      refillRate: 5,
      capacity: 20,
    }),
  ],
});

// Consume a single token from the bucket for each protected request.
const ARCJET_REQUEST_PROPERTIES = { requested: 1 } as const;

export async function protectWithArcjet(
  details: ArcjetReactRouterRequest,
): Promise<ArcjetDecision> {
  return arcjetClient.protect(details, ARCJET_REQUEST_PROPERTIES);
}

export function arcjetDecisionToResponse(decision: ArcjetDecision) {
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response("Too Many Requests", { status: 429 });
    }

    return new Response("Forbidden", { status: 403 });
  }

  if (decision.isChallenged()) {
    return new Response("Arcjet challenge required", { status: 401 });
  }

  return null;
}
