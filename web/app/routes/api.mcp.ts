import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { getMcpServer } from "../mcp/mcp.server";
import { captureMcpEvent } from "../modules/posthog.server";

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
  handler: "loader" | "action",
) {
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

export async function loader({ request }: LoaderFunctionArgs) {
  return handleMcpRequest(request, "loader");
}

export async function action({ request }: ActionFunctionArgs) {
  return handleMcpRequest(request, "action");
}
