import { Link } from "react-router";
import { NavSearch } from "./search.nav";
import { PropsWithChildren, useRef, useState } from "react";
import { clsx } from "clsx";
import { RiMenuLine } from "@remixicon/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Props = PropsWithChildren<{
  className?: string;
  hasMenu?: boolean;
  hasSubtleBackground?: boolean;
  inputClassName?: string;
}>;

export default function NavigationPage(props: Props) {
  const { className, children, hasMenu, hasSubtleBackground, inputClassName } =
    props;

  const searchContentPortalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Statistics", path: "/statistic" },
    { label: "Privacy", path: "/privacy" },
    {
      label: "Press",
      submenu: [
        { label: "News", path: "/press/news" },
        { label: "Magazine", path: "/press/magazine" },
      ],
    },
  ];

  const renderMenu = () => {
    if (!hasMenu) return null;

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="group flex h-full cursor-pointer items-center pl-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600"
            aria-label="Navigation menu"
          >
            <RiMenuLine
              size={18}
              className="text-gray-dim group-hover:animate-wiggle-more group-hover:animate-infinite"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 min-w-[220px] rounded-lg bg-[#000]/40 bg-white/80 p-1.5 shadow-lg backdrop-blur-lg duration-200"
            sideOffset={5}
            align="end"
            aria-label="Navigation menu"
          >
            {menuItems.map((item) => {
              if (item.submenu) {
                return (
                  <DropdownMenu.Sub key={item.label}>
                    <DropdownMenu.SubTrigger
                      className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm outline-none hover:bg-gray-100/80 focus:bg-gray-100/80 data-[state=open]:bg-gray-100/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80 dark:data-[state=open]:bg-gray-800/80"
                      aria-label={`${item.label} submenu`}
                    >
                      {item.label}
                      <span className="ml-2" aria-hidden="true">
                        →
                      </span>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.SubContent
                        className="data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 min-w-[220px] rounded-lg bg-white/80 p-1.5 shadow-lg backdrop-blur-lg duration-200 dark:bg-gray-900/80"
                        sideOffset={2}
                        alignOffset={-5}
                      >
                        {item.submenu.map((subItem) => (
                          <DropdownMenu.Item
                            key={subItem.path}
                            className="outline-none focus:outline-none"
                          >
                            <Link
                              to={subItem.path}
                              className="block rounded-md px-2.5 py-2 text-sm hover:bg-gray-100/80 focus:bg-gray-100/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80"
                            >
                              {subItem.label}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Sub>
                );
              }

              return (
                <DropdownMenu.Item
                  key={item.path}
                  className="outline-none focus:outline-none"
                >
                  <Link
                    to={item.path}
                    className="block rounded-md px-2.5 py-2 text-sm hover:bg-gray-100/80 focus:bg-gray-100/80 dark:hover:bg-gray-800/80 dark:focus:bg-gray-800/80"
                  >
                    {item.label}
                  </Link>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  };

  return (
    <>
      <nav
        className={clsx(
          "full-width border-gray-8 dark:border-gray-12 sticky inset-x-0 top-0 z-10 border-b backdrop-blur-lg",
          { "bg-[#fff]/90 dark:bg-[#000]/90": isFocused },
          {
            "border-transparent bg-[#000]/10 dark:border-transparent dark:bg-[#000]/25":
              !isFocused && hasSubtleBackground,
          },
          className,
        )}
      >
        <NavSearch
          searchContentRef={searchContentPortalRef}
          inputRef={inputRef}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          inputClassName={inputClassName}
          actions={renderMenu()}
        />
      </nav>

      {children}

      <div id="search-content-portal" ref={searchContentPortalRef} />
    </>
  );
}
