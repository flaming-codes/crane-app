import type { Route } from "./+types/home";
import { Welcome } from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Telemetry Dashboard" },
    {
      name: "description",
      content: "Overview of your system's observability data.",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
