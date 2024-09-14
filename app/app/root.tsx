import {
 Links,
 Meta,
 Outlet,
 Scripts,
 ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import {
 Content,
 ExpandableSearch,
 GlobalTheme,
 Header,
 HeaderGlobalAction,
 HeaderGlobalBar,
 HeaderMenu,
 HeaderMenuButton,
 HeaderMenuItem,
 HeaderName,
 HeaderNavigation,
 HeaderSideNavItems,
 SideNav,
 SideNavItems,
 SideNavLink,
 SideNavMenu,
 SideNavMenuItem,
 SkipToContent,
 Theme,
} from "@carbon/react";
import { Notification } from "@carbon/icons-react";
import { useEffect } from "react";
import "./root.scss";

export const links: LinksFunction = () => [
 { rel: "preconnect", href: "https://fonts.googleapis.com" },
 {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous",
 },
 {
  rel: "stylesheet",
  href:
   "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap",
 },
];

export function Layout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="en">
   <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
   </head>
   <body>
    {children}
    <ScrollRestoration />
    <Scripts />
   </body>
  </html>
 );
}

export default function App() {
 const theme = "g100";

 useEffect(() => {
  document.documentElement.dataset.carbonTheme = theme;
 }, [theme]);

 return (
  <GlobalTheme theme={theme}>
   <Theme theme={theme}>
    <Header aria-label="IBM Platform Name">
     <SkipToContent />
     <HeaderMenuButton
      aria-label={true ? "Close menu" : "Open menu"}
      onClick={() => {}}
      isActive={true}
      aria-expanded={true}
     />
     <HeaderName href="/" prefix="">
      CRAN/E
     </HeaderName>
     <HeaderNavigation aria-label="IBM [Platform]">
      <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
      <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
      <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
      <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
       <HeaderMenuItem href="#one">Sub-link 1</HeaderMenuItem>
       <HeaderMenuItem href="#two">Sub-link 2</HeaderMenuItem>
       <HeaderMenuItem href="#three">Sub-link 3</HeaderMenuItem>
      </HeaderMenu>
     </HeaderNavigation>
     <HeaderGlobalBar>
      <ExpandableSearch
       size="lg"
       labelText="Search"
       closeButtonLabelText="Clear search input"
       id="search-expandable-1"
       onChange={() => {}}
       onKeyDown={() => {}}
      />

      <HeaderGlobalAction aria-label="Notifications">
       <Notification size={20} />
      </HeaderGlobalAction>
     </HeaderGlobalBar>
     <SideNav
      aria-label="Side navigation"
      expanded={true}
      onSideNavBlur={() => {}}
      href="#main-content"
     >
      <SideNavItems>
       <HeaderSideNavItems hasDivider={true}>
        <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
        <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
        <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
        <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
         <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
         <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
         <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
        </HeaderMenu>
       </HeaderSideNavItems>
       <SideNavMenu title="Category title">
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 5
        </SideNavMenuItem>
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 6
        </SideNavMenuItem>
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 7
        </SideNavMenuItem>
       </SideNavMenu>
       <SideNavMenu title="Category title">
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 8
        </SideNavMenuItem>
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 9
        </SideNavMenuItem>
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 10
        </SideNavMenuItem>
       </SideNavMenu>
       <SideNavMenu title="Category title" isActive={true}>
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 11
        </SideNavMenuItem>
        <SideNavMenuItem
         aria-current="page"
         href="https://www.carbondesignsystem.com/"
        >
         Link 12
        </SideNavMenuItem>
        <SideNavMenuItem href="https://www.carbondesignsystem.com/">
         Link 13
        </SideNavMenuItem>
       </SideNavMenu>
       <SideNavLink href="https://www.carbondesignsystem.com/">
        Link
       </SideNavLink>
       <SideNavLink href="https://www.carbondesignsystem.com/">
        Link
       </SideNavLink>
      </SideNavItems>
     </SideNav>
    </Header>
    <Content>
     <Outlet />
    </Content>
   </Theme>
  </GlobalTheme>
 );
}
