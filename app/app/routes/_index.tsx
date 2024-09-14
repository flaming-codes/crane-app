import { Button } from "@carbon/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
 return [
  { title: "New Remix App" },
  { name: "description", content: "Welcome to Remix!" },
 ];
};

export default function Index() {
 return (
  <div className="flex h-screen items-center justify-center">
   <div className="flex flex-col items-center gap-16">
    <Button>Click</Button>
   </div>
  </div>
 );
}
