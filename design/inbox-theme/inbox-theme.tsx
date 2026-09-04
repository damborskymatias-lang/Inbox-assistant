import { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { DeepPartial, mergeTokenSchema } from '@bitdesign/sparks.sparks-theme';
import { InboxThemeProvider } from './inbox-theme-provider.js';
import { InboxThemeSchema } from './inbox-tokens.js';
import { ThemeContext, ThemeContextValue, ThemeMode } from './theme-controller.js';
import { themeOptions } from './theme-options.js';
import styles from './inbox-theme.module.scss';

export type InboxThemeProps = {
  /**
   * a root ReactNode for the component tree
   * applied with the theme.
   */
  children?: ReactNode;

  /**
   * inject a class name to override to the theme.
   */
  className?: string;

  /**
   * override tokens in the schema.
   */
  overrides?: DeepPartial<InboxThemeSchema>;

  /**
   * preset of the theme.
   */
  initialTheme?: ThemeMode;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;
};

/**
 * a theme for the AI inbox assistant.
 * it provides tokens, fonts and general styling for all components.
 */
export function InboxTheme({ children, initialTheme, overrides, className, style }: InboxThemeProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialTheme || 'light');
  const themePreset = themeOptions[themeMode];

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const themeContextValue: ThemeContextValue = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  const themeOverrides = themePreset ? mergeTokenSchema(themePreset, overrides) : overrides;

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <InboxThemeProvider.ThemeProvider
        className={classNames(styles.inboxTheme, className)}
        overrides={themeOverrides}
        style={style}
      >
        {children}
      </InboxThemeProvider.ThemeProvider>
    </ThemeContext.Provider>
  );
}
