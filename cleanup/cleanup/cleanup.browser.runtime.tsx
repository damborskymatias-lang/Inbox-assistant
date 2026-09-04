import React from 'react';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformBrowser,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformBrowser,
} from '@lov/inbox-platform.inbox-platform';
import { CleanupPage } from '@lov/cleanup.pages.cleanup-page';
import { CleanupPanel } from '@lov/cleanup.dashboard-panel.cleanup-panel';
import { BroomIcon } from '@lov/cleanup.icons.cleanup-icons';
import type { CleanupConfig } from './cleanup-config.js';
import { SuggestionCountStore } from './suggestion-count-store.js';

/**
 * path of the protected cleanup page.
 */
const CLEANUP_PATH = '/cleanup';

export class CleanupBrowser {
  constructor(
    private cleanupConfig: CleanupConfig,
    private suggestionCountStore: SuggestionCountStore,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private inboxPlatform: InboxPlatformBrowser
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): CleanupConfig {
    return this.cleanupConfig;
  }

  /**
   * the path the cleanup page is mounted on.
   */
  get cleanupPath(): string {
    return this.cleanupConfig.cleanupPath || CLEANUP_PATH;
  }

  /**
   * the amount of open cleanup suggestions, rendered as the badge of the
   * "Cleanup" navigation item.
   */
  getSuggestionCount(): number | undefined {
    return this.suggestionCountStore.getCount();
  }

  /**
   * all routes currently registered to the platform, including the cleanup route.
   */
  listRoutes() {
    return this.symphonyPlatform.listRoutes();
  }

  /**
   * all navigation items currently registered to the platform.
   */
  listNavigationItems() {
    return this.inboxPlatform.listNavigationItems();
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect];

  static defaultConfig: CleanupConfig = {
    cleanupPath: CLEANUP_PATH,
  };

  static async provider(
    [symphonyPlatform, inboxPlatform]: [SymphonyPlatformBrowser, InboxPlatformBrowser],
    config: CleanupConfig
  ) {
    const cleanup = new CleanupBrowser(
      config,
      new SuggestionCountStore(),
      symphonyPlatform,
      inboxPlatform
    );

    const cleanupPath = config.cleanupPath || CLEANUP_PATH;

    /**
     * the protected page listing every detected cleanup suggestion.
     */
    inboxPlatform.registerRoute([
      {
        path: cleanupPath,
        component: () => <CleanupPage redirectTo="/login" />,
        protected: true,
      },
    ]);

    /**
     * the sidebar entry linking to the cleanup page, badged with the amount
     * of suggestions waiting for the user.
     */
    inboxPlatform.registerNavigationItem([
      {
        label: 'Cleanup',
        href: cleanupPath,
        icon: () => <BroomIcon size="sm" />,
        weight: 30,
        badge: () => cleanup.getSuggestionCount(),
      },
    ]);

    /**
     * the dashboard panel surfacing the highest impact cleanup inline,
     * exactly like the prototype banner.
     */
    inboxPlatform.registerDashboardPanel([
      {
        name: 'cleanup-panel',
        component: () => <CleanupPanel cleanupHref={cleanupPath} />,
        span: 'full',
        weight: 20,
      },
    ]);

    return cleanup;
  }
}

export default CleanupBrowser;
