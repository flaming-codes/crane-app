import { Outlet } from "react-router";
import NavigationPage from "../modules/nav";
import { Toaster } from "sonner";
import { cva } from "cva";

export const handle = {
  hasFooter: true,
};

const twToaster = cva({
  base: "bg-gradient-to-tr px-6 py-4 text-sm backdrop-blur-lg rounded-lg w-full inline-flex gap-2 items-center",
  variants: {
    variant: {
      default: "from-gray-2 dark:from-gray-12",
      success: "from-grass-6 dark:from-grass-11",
      error: "from-crimson-6 dark:from-crimson-11",
      info: "from-sky-6 dark:from-sky-11",
      warning: "from-amber-6 dark:from-amber-11",
    },
  },
});

export default function PackageLayoutPage() {
  return (
    <>
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: twToaster({}),
            success: twToaster({ variant: "success" }),
            error: twToaster({ variant: "error" }),
            info: twToaster({ variant: "info" }),
            warning: twToaster({ variant: "warning" }),
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
