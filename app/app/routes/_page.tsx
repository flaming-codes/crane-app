import { Outlet } from "@remix-run/react";

export default function PackageLayoutPage() {
  return (
    <>
      <nav className="border-b border-gray-8 dark:border-gray-12 h-14 flex items-center sticky top-0 backdrop-blur-lg full-width">
        <span>Search</span>
      </nav>

      <Outlet />
    </>
  );
}
