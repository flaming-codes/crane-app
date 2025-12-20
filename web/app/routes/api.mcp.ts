import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { getMcpServer } from "../mcp/mcp.server";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const t = getTransport();
  return t.handleRequest(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const t = getTransport();
  return t.handleRequest(request);
}
