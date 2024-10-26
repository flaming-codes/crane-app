import { Outlet } from "@remix-run/react";
import NavigationPage from "../modules/nav";

export const handle = {
  hasFooter: true,
};

export default function PackageLayoutPage() {
  return (
    <NavigationPage hasHomeLink>
      <Outlet />
    </NavigationPage>
  );
}
