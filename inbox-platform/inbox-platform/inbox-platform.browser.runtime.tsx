import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformBrowser,
} from '@bitdev/symphony.symphony-platform';
import { InboxTheme } from '@lov/design.inbox-theme';
import { AppLayout } from '@lov/inbox-platform.layout.app-layout';
import { ProtectedRoute } from '@lov/inbox-platform.ui.protected-route';
import { Home } from '@lov/inbox-platform.pages.home';
import { Dashboard } from '@lov/inbox-platform.pages.dashboard';
import { Login } from '@lov/inbox-platform.pages.login';
import { NotFoundPage } from '@lov/inbox-platform.pages.not-found-page';
import type { Route } from './route.js';
import type { NavigationItem, NavigationItemSlot } from './navigation-item.js';
import type { DashboardPanel, DashboardPanelSlot } from './dashboard-panel.js';
import type { HeaderAction, HeaderActionSlot } from './header-action.js';
import type { UserBarMenuItem, UserBarMenuItemSlot } from './user-bar-menu-item.js';

export class InboxPlatformBrowser {
  constructor(
    private navigationItemSlot: NavigationItemSlot,
    private dashboardPanelSlot: DashboardPanelSlot,
    private headerActionSlot: HeaderActionSlot,
    private userBarMenuItemSlot: UserBarMenuItemSlot,
    private symphonyPlatform: SymphonyPlatformBrowser
  ) {}

  /**
   * register application routes contributed by feature aspects.
   */
  registerRoute(routes: Route[]) {
    this.symphonyPlatform.registerRoute(routes);
    return this;
  }

  /**
   * list all routes registered to the platform.
   */
  listRoutes(): Route[] {
    return this.symphonyPlatform.listRoutes();
  }

  /**
   * register sidebar navigation entries contributed by feature aspects.
   */
  registerNavigationItem(navigationItems: NavigationItem[]) {
    this.navigationItemSlot.register(navigationItems);
    return this;
  }

  /**
   * list all registered navigation items.
   */
  listNavigationItems(): NavigationItem[] {
    return this.navigationItemSlot.flatValues();
  }

  /**
   * register panels rendered on the dashboard, ordered by weight.
   */
  registerDashboardPanel(dashboardPanels: DashboardPanel[]) {
    this.dashboardPanelSlot.register(dashboardPanels);
    return this;
  }

  /**
   * list all registered dashboard panels.
   */
  listDashboardPanels(): DashboardPanel[] {
    return this.dashboardPanelSlot.flatValues();
  }

  /**
   * register persistent actions or indicators rendered in the app header.
   */
  registerHeaderAction(headerActions: HeaderAction[]) {
    this.headerActionSlot.register(headerActions);
    return this;
  }

  /**
   * list all registered header actions.
   */
  listHeaderActions(): HeaderAction[] {
    return this.headerActionSlot.flatValues();
  }

  /**
   * register items rendered in the signed-in user dropdown menu.
   */
  registerUserBarMenuItem(userBarMenuItems: UserBarMenuItem[]) {
    this.userBarMenuItemSlot.register(userBarMenuItems);
    return this;
  }

  /**
   * list all registered user bar menu items.
   */
  listUserBarMenuItems(): UserBarMenuItem[] {
    return this.userBarMenuItemSlot.flatValues();
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig = {};

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformBrowser],
    _config: Record<string, never>,
    [navigationItemSlot, dashboardPanelSlot, headerActionSlot, userBarMenuItemSlot]: [
      NavigationItemSlot,
      DashboardPanelSlot,
      HeaderActionSlot,
      UserBarMenuItemSlot
    ]
  ) {
    const inboxPlatform = new InboxPlatformBrowser(
      navigationItemSlot,
      dashboardPanelSlot,
      headerActionSlot,
      userBarMenuItemSlot,
      symphonyPlatform
    );

    /**
     * the root route. renders the marketing homepage for anonymous visitors
     * and the dashboard for authenticated users.
     */
    function HomeRoute() {
      const navigate = useNavigate();
      const dashboardPanels = inboxPlatform.listDashboardPanels();

      return (
        <Home dashboardPanels={dashboardPanels} onGetStarted={() => navigate('/login')} />
      );
    }

    /**
     * the authenticated dashboard, composing every panel registered by feature aspects.
     */
    function DashboardRoute() {
      const dashboardPanels = inboxPlatform.listDashboardPanels();

      return (
        <ProtectedRoute redirectTo="/login">
          <Dashboard panels={dashboardPanels} />
        </ProtectedRoute>
      );
    }

    /**
     * register the app layout. the layout reads slot values at render time,
     * so items registered by feature aspects are always available.
     */
    symphonyPlatform.registerLayoutComponent(({ children }) => {
      const navigationItems = inboxPlatform.listNavigationItems();
      const headerActions = inboxPlatform.listHeaderActions();
      const userBarMenuItems = inboxPlatform.listUserBarMenuItems();

      return (
        <AppLayout
          navigationItems={navigationItems}
          headerActions={headerActions}
          userBarMenuItems={userBarMenuItems}
        >
          {children}
        </AppLayout>
      );
    });

    /**
     * register the core platform routes.
     */
    inboxPlatform.registerRoute([
      {
        path: '/',
        component: HomeRoute,
      },
      {
        path: '/login',
        component: () => <Login redirectPath="/dashboard" />,
      },
      {
        path: '/dashboard',
        component: DashboardRoute,
        protected: true,
      },
    ]);

    symphonyPlatform.registerPageNotFound(() => <NotFoundPage />);

    symphonyPlatform.registerTheme((props) => <InboxTheme {...props} />);

    return inboxPlatform;
  }
}

export default InboxPlatformBrowser;
