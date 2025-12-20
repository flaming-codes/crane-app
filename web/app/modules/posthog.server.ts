import { createHash } from "node:crypto";
import { PostHog } from "posthog-node";
import { ENV } from "../data/env";

let posthogClient: PostHog | null = null;

function getPostHogClient() {
  if (!ENV.POSTHOG_API_KEY) return null;

  if (!posthogClient) {
    posthogClient = new PostHog(ENV.POSTHOG_API_KEY, {
      host: ENV.POSTHOG_HOST,
    });
  }

  return posthogClient;
}

function getDistinctId(ip: string | null, userAgent: string | null) {
  const source = `${ip ?? ""}:${userAgent ?? ""}`;
  if (!source.trim()) return "mcp-anonymous";

  return createHash("sha256").update(source).digest("hex");
}

type CaptureMcpEventParams = {
  event: string;
  request: Request;
  properties?: Record<string, unknown>;
  error?: unknown;
};

export async function captureMcpEvent({
  event,
  request,
  properties,
  error,
}: CaptureMcpEventParams) {
  const client = getPostHogClient();
  if (!client) return;

  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent");
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for");

  const baseProperties = {
    path: url.pathname,
    method: request.method,
    search: url.search || undefined,
    host: url.host,
    userAgent: userAgent || undefined,
    ip: ip || undefined,
    error:
      error instanceof Error
        ? error.message
        : error
          ? String(error)
          : undefined,
  };

  client.capture({
    distinctId: getDistinctId(ip, userAgent),
    event,
    properties: {
      ...baseProperties,
      ...properties,
    },
  });
}
