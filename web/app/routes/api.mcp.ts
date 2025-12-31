import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { getMcpServer } from "../mcp/mcp.server";
import { captureMcpEvent } from "../modules/posthog.server";
import {
  arcjetDecisionToResponse,
  protectWithArcjet,
} from "../modules/arcjet.server";

// Singleton transport instance to maintain state (sessions, connections)
let transport: WebStandardStreamableHTTPServerTransport | null = null;

function getTransport() {
  if (!transport) {
    transport = new WebStandardStreamableHTTPServerTransport({
      // Stateless mode or stateful mode configuration if needed
    });

    const server = getMcpServer();
    server.connect(transport);
  }
  return transport;
}

async function handleMcpRequest(
  request: Request,
  context: LoaderFunctionArgs["context"],
  handler: "loader" | "action",
) {
  const decision = await protectWithArcjet({ request, context });
  const deniedResponse = arcjetDecisionToResponse(decision);

  if (deniedResponse) {
    return deniedResponse;
  }

  const t = getTransport();
  try {
    const response = await t.handleRequest(request);
    await captureMcpEvent({
      event: "mcp_request_success",
      request,
      properties: { handler, status: response.status },
    });
    return response;
  } catch (error) {
    await captureMcpEvent({
      event: "mcp_request_error",
      request,
      properties: { handler },
      error,
    });
    throw error;
  }
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  return handleMcpRequest(request, context, "loader");
}

export async function action({ request, context }: ActionFunctionArgs) {
  return handleMcpRequest(request, context, "action");
}
