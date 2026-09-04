import React from 'react';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformBrowser,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformBrowser,
} from '@lov/inbox-platform.inbox-platform';
import type { Route } from '@bitdev/symphony.frontends.route';
import { PricingPage } from '@lov/billing.pages.pricing-page';
import { BillingPage } from '@lov/billing.pages.billing-page';
import { PlanPanel } from '@lov/billing.dashboard-panel.plan-panel';
import { CreditCardIcon } from '@lov/billing.icons.billing-icons';
import type { BillingConfig } from './billing-config.js';

/**
 * path of the public pricing page.
 */
const PRICING_PATH = '/pricing';

/**
 * path of the protected billing page.
 */
const BILLING_PATH = '/billing';

export class BillingBrowser {
  constructor(
    private billingConfig: BillingConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private inboxPlatform: InboxPlatformBrowser
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): BillingConfig {
    return this.billingConfig;
  }

  /**
   * the path of the public pricing page registered by this aspect.
   */
  get pricingPath(): string {
    return this.billingConfig.pricingPath || PRICING_PATH;
  }

  /**
   * the path of the protected billing page registered by this aspect.
   */
  get billingPath(): string {
    return this.billingConfig.billingPath || BILLING_PATH;
  }

  /**
   * all routes currently registered to the platform, including the billing routes.
   */
  listRoutes(): Route[] {
    return this.symphonyPlatform.listRoutes();
  }

  /**
   * all user bar menu items currently registered to the platform.
   */
  listUserBarMenuItems() {
    return this.inboxPlatform.listUserBarMenuItems();
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect];

  static defaultConfig: BillingConfig = {
    pricingPath: PRICING_PATH,
    billingPath: BILLING_PATH,
  };

  static async provider(
    [symphonyPlatform, inboxPlatform]: [SymphonyPlatformBrowser, InboxPlatformBrowser],
    config: BillingConfig
  ) {
    const billing = new BillingBrowser(config, symphonyPlatform, inboxPlatform);
    const pricingPath = config.pricingPath || PRICING_PATH;
    const billingPath = config.billingPath || BILLING_PATH;

    /**
     * the public pricing page and the protected billing dashboard.
     */
    inboxPlatform.registerRoute([
      {
        path: pricingPath,
        component: () => <PricingPage />,
      },
      {
        path: billingPath,
        component: () => <BillingPage redirectTo="/login" />,
        protected: true,
      },
    ]);

    /**
     * the Billing entry in the signed-in user dropdown menu.
     */
    inboxPlatform.registerUserBarMenuItem([
      {
        label: 'Billing',
        href: billingPath,
        icon: () => <CreditCardIcon size="sm" />,
        weight: 20,
      },
    ]);

    /**
     * the dashboard panel showing the current plan and the AI reply quota meter.
     */
    inboxPlatform.registerDashboardPanel([
      {
        name: 'plan-panel',
        component: () => <PlanPanel upgradeHref={pricingPath} />,
        span: 'half',
        weight: 40,
      },
    ]);

    return billing;
  }
}

export default BillingBrowser;
