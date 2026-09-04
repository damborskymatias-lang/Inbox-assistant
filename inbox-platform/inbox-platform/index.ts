import { InboxPlatformAspect } from './inbox-platform.aspect.js';

export type { InboxPlatformBrowser } from './inbox-platform.browser.runtime.js';
export type {
  InboxPlatformNode,
  GoogleTokens,
  AuthPayload,
} from './inbox-platform.node.runtime.js';
export type { InboxPlatformConfig } from './inbox-platform-config.js';
export type { Route, RouteSlot } from './route.js';
export type { NavigationItem, NavigationItemSlot } from './navigation-item.js';
export type { DashboardPanel, DashboardPanelSlot } from './dashboard-panel.js';
export type { HeaderAction, HeaderActionSlot } from './header-action.js';
export type { UserBarMenuItem, UserBarMenuItemSlot } from './user-bar-menu-item.js';

export default InboxPlatformAspect;
export { InboxPlatformAspect };
