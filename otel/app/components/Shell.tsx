import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  Content,
  Theme,
} from "@carbon/react";
import {
  Notification,
  UserAvatar,
  Switcher,
  Dashboard,
  Activity,
  List,
  ChartLine,
} from "@carbon/icons-react";
import { Link, useLocation } from "react-router";

export function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Theme theme="g100">
          <Header aria-label="Crane Telemetry">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="/" prefix="CRANE">
              Telemetry
            </HeaderName>
            <HeaderNavigation aria-label="Crane Telemetry">
              <HeaderMenuItem as={Link} to="/traces">
                Traces
              </HeaderMenuItem>
              <HeaderMenuItem as={Link} to="/logs">
                Logs
              </HeaderMenuItem>
              <HeaderMenuItem as={Link} to="/metrics">
                Metrics
              </HeaderMenuItem>
            </HeaderNavigation>
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Notifications"
                tooltipAlignment="center"
              >
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="User Avatar"
                tooltipAlignment="center"
              >
                <UserAvatar size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="App Switcher"
                tooltipAlignment="end"
              >
                <Switcher size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isFixedNav
            >
              <SideNavItems>
                <SideNavLink
                  renderIcon={Dashboard}
                  as={Link}
                  to="/"
                  isActive={location.pathname === "/"}
                >
                  Dashboard
                </SideNavLink>
                <SideNavLink
                  renderIcon={Activity}
                  as={Link}
                  to="/traces"
                  isActive={location.pathname.startsWith("/traces")}
                >
                  Traces
                </SideNavLink>
                <SideNavLink
                  renderIcon={List}
                  as={Link}
                  to="/logs"
                  isActive={location.pathname.startsWith("/logs")}
                >
                  Logs
                </SideNavLink>
                <SideNavLink
                  renderIcon={ChartLine}
                  as={Link}
                  to="/metrics"
                  isActive={location.pathname.startsWith("/metrics")}
                >
                  Metrics
                </SideNavLink>
              </SideNavItems>
            </SideNav>
          </Header>
          <Content className="p-0">{children}</Content>
        </Theme>
      )}
    />
  );
}
