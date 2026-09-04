import React from 'react';
import { createMounter } from '@teambit/react.mounter';
import { InboxTheme } from '@lov/design.inbox-theme';

export function MyReactProvider({ children }: { children: React.ReactNode }) {
  return <InboxTheme>{children}</InboxTheme>;
}

/**
 * The entry for the app (preview runtime) that renders your component previews.
 * This mounter wraps compositions with the theme provider.
 * @see https://docs/react-env/component-previews#composition-mounter
 */
export default createMounter(MyReactProvider) as any;
