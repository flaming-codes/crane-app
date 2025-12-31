import { ActionFunction } from "react-router";
import {
  arcjetDecisionToResponse,
  protectWithArcjet,
} from "../modules/arcjet.server";
import { SearchService } from "../data/search.service";

export const action: ActionFunction = async ({ request, context }) => {
  const decision = await protectWithArcjet({ request, context });
  const deniedResponse = arcjetDecisionToResponse(decision);

  if (deniedResponse) {
    return deniedResponse;
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "all") {
    const query = String(formData.get("q")).slice(0, 100);
    const result = await SearchService.searchUniversal(query);
    return Response.json(result);
  }

  throw new Error("Invalid intent");
};
