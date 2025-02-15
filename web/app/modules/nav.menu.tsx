import { Link } from "react-router";
import { clsx } from "clsx";
import { RiMenuLine } from "@remixicon/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const menuItems = [
  // Main navigation
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Privacy", path: "/privacy" },
  { type: "separator" as const },

  // Statistics group
  { label: "Package Trends", path: "/statistic/packages/trends" },
  { label: "Download Stats", path: "/statistic/packages/downloads" },
  { label: "R Releases", path: "/statistic/r-releases" },
  { type: "separator" as const },

  // Press section
  { label: "News", path: "/press/news" },
  { label: "Magazine", path: "/press/magazine" },
];

const dropdownContentClasses = clsx(
  "min-w-[220px] rounded-lg p-1.5 shadow-lg duration-200 z-50",
  "bg-white/40 backdrop-blur-md dark:border border-gray-dim dark:bg-black/40",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
);

const menuItemClasses = clsx(
  "block rounded-md px-2.5 py-2 text-xs",
  "hover:opacity-50 transition-opacity duration-200",
);

const separatorClasses = clsx("my-1 h-px bg-[#000]/10 dark:bg-[#fff]/10");

export function NavMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="group flex h-full cursor-pointer items-center pl-4 focus:outline-none"
          aria-label="Navigation menu"
        >
          <RiMenuLine
            size={18}
            className="text-gray-dim group-hover:animate-wiggle group-hover:animate-infinite"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={dropdownContentClasses}
          sideOffset={5}
          align="end"
          aria-label="Navigation menu"
        >
          {menuItems.map((item, index) =>
            item.type === "separator" ? (
              <DropdownMenu.Separator
                key={`sep-${index}`}
                className={separatorClasses}
              />
            ) : (
              <DropdownMenu.Item
                key={item.path}
                className="outline-none focus:outline-none"
                asChild
              >
                <Link to={item.path} className={menuItemClasses}>
                  {item.label}
                </Link>
              </DropdownMenu.Item>
            ),
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

NavMenu.displayName = "NavMenu";
