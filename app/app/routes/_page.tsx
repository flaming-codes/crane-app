import { Outlet } from "@remix-run/react";
import NavigationPage from "../modules/nav";
import { lazy } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { Toaster } from "sonner";

export const handle = {
  hasFooter: true,
};

export default function PackageLayoutPage() {
  return (
    <>
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "from-gray-2 dark:from-gray-12 bg-gradient-to-tr px-6 py-4 text-sm backdrop-blur-lg rounded-lg w-full inline-flex gap-2 items-center",
            success: "from-grass-6 dark:from-grass-11",
            error: "from-crimson-6 dark:from-crimson-11",
            info: "from-sky-6 dark:from-sky-11",
            title: "text-gray-normal",
            description: "text-gray-dim",
            actionButton: "text-sky-normal",
            cancelButton: "text-ruby-normal",
            closeButton: "text-gray-normal",
          },
        }}
      />
      <NavigationPage hasHomeLink>
        <Outlet />
      </NavigationPage>
    </>
  );
}
