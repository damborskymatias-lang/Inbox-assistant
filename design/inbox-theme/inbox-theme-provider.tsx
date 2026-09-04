import { createTheme } from '@bitdesign/sparks.sparks-theme';
import { InboxThemeSchema, inboxTokens } from './inbox-tokens.js';

/**
 * creating and declaring the inbox theme.
 * define the theme schema as a type variable for proper type completions.
 */
export const InboxThemeProvider = createTheme<InboxThemeSchema>({
  tokens: inboxTokens,
});

/**
 * a react hook for contextual access to design tokens
 * from components.
 */
export const { useTheme } = InboxThemeProvider;
