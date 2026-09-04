import { ProductivityAspect } from './productivity.aspect.js';

export type { ProductivityBrowser } from './productivity.browser.runtime.js';
export type { ProductivityNode } from './productivity.node.runtime.js';
export type { ProductivityConfig } from './productivity-config.js';
export type {
  TrackActionOptions,
  ListDigestsOptions,
  UpdateNotificationPreferencesOptions,
  DigestIncrements,
} from './productivity-types.js';

export default ProductivityAspect;
export { ProductivityAspect };
