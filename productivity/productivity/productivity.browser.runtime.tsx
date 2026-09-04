import React from 'react';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformBrowser,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformBrowser,
} from '@lov/inbox-platform.inbox-platform';
import { DigestPage } from '@lov/productivity.pages.digest-page';
import { DigestPanel } from '@lov/productivity.dashboard-panel.digest-panel';
import { TimeSavedIndicator } from '@lov/productivity.ui.time-saved-indicator';
import { DigestIcon } from '@lov/productivity.icons.productivity-icons';
import type { Route } from '@bitdev/symphony.frontends.route';
import type { ProductivityConfig } from './productivity-config.js';

/**
 * path of the daily digest page.
 */
const DIGEST_PATH = '/digest';

export class ProductivityBrowser {
  constructor(
    private productivityConfig: ProductivityConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private inboxPlatform: InboxPlatformBrowser
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): ProductivityConfig {
    return this.productivityConfig;
  }

  /**
   * the path of the daily digest page registered by this aspect.
   */
  get digestPath(): string {
    return this.productivityConfig.digestPath || DIGEST_PATH;
  }

  /**
   * all routes currently registered to the platform, including the digest route.
   */
  listRoutes(): Route[] {
    return this.symphonyPlatform.listRoutes();
  }

  /**
   * all navigation items currently registered to the platform.
   */
  listNavigationItems() {
    return this.inboxPlatform.listNavigationItems();
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect];

  static defaultConfig: ProductivityConfig = {
    historyDays: 7,
    digestPath: DIGEST_PATH,
  };

  static async provider(
    [symphonyPlatform, inboxPlatform]: [SymphonyPlatformBrowser, InboxPlatformBrowser],
    config: ProductivityConfig
  ) {
    const productivity = new ProductivityBrowser(config, symphonyPlatform, inboxPlatform);
    const digestPath = config.digestPath || DIGEST_PATH;

    /**
     * the protected daily digest page, showing today's headline, the weekly
     * trend and the notification preferences.
     */
    inboxPlatform.registerRoute([
      {
        path: digestPath,
        component: () => <DigestPage redirectTo="/login" />,
        protected: true,
      },
    ]);

    /**
     * the sidebar entry linking to the daily digest.
     */
    inboxPlatform.registerNavigationItem([
      {
        label: 'Digest',
        href: digestPath,
        icon: () => <DigestIcon size="sm" />,
        weight: 40,
      },
    ]);

    /**
     * the header pill showing the minutes saved today by the assistant.
     */
    inboxPlatform.registerHeaderAction([
      {
        name: 'time-saved-indicator',
        component: () => <TimeSavedIndicator digestHref={digestPath} />,
        weight: 20,
      },
    ]);

    /**
     * the dashboard panel summarizing today's time saved.
     */
    inboxPlatform.registerDashboardPanel([
      {
        name: 'digest-panel',
        component: () => <DigestPanel digestLink={digestPath} />,
        span: 'half',
        weight: 30,
      },
    ]);

    return productivity;
  }
}

export default ProductivityBrowser;
