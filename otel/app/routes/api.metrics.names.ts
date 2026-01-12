import { type LoaderFunctionArgs } from "react-router";
import { db } from "../db/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const names = db
    .prepare(
      "SELECT DISTINCT metric_name FROM metric_points ORDER BY metric_name",
    )
    .all();
  return new Response(
    JSON.stringify({ names: names.map((n: any) => n.metric_name) }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
