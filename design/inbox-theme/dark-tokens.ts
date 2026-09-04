import { DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { InboxThemeSchema } from './inbox-tokens.js';

/**
 * override tokens for the dark theme.
 * overrides the default light theme tokens.
 */
export const darkThemeSchema: DeepPartial<InboxThemeSchema> = {
  colors: {
    primary: {
      default: '#818cf8',
      hover: '#a5b4fc',
      active: '#6366f1',
    },
    secondary: {
      default: '#1e2340',
      hover: '#262c4c',
      active: '#2c335a',
    },
    surface: {
      background: '#0b0f1a', // Dark background
      primary: '#131829', // Card / panel surface
      secondary: '#1a2036', // Chips, subtle surfaces
    },
    text: {
      primary: '#f1f3fb', // Light ink for dark backgrounds
      default: '#f1f3fb',
      secondary: '#a7adc4', // Softer light text
      muted: '#7a8099', // Muted light text
      inverse: '#0f1729',
    },
    status: {
      positive: { default: '#4ade80', subtle: '#0f2b1c' },
      negative: { default: '#f87171', subtle: '#3a1418' },
      warning: { default: '#facc73', subtle: '#332108' },
      info: { default: '#818cf8', subtle: '#1e2340' },
    },
    triage: {
      urgent: { default: '#f87171', subtle: '#3a1418' },
      needsReply: { default: '#fbbf46', subtle: '#332108' },
      fyi: { default: '#4ade80', subtle: '#0f2b1c' },
      promotions: { default: '#9ca3b8', subtle: '#1e2230' },
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  borders: {
    default: {
      color: '#262c44',
      width: '1px',
      style: 'solid',
    },
    focus: {
      color: '#818cf8',
      width: '2px',
      style: 'solid',
      offset: '1px',
    },
    radius: {
      small: '8px',
      medium: '10px',
      large: '12px',
      xlarge: '16px',
      full: '999px',
    },
  },
};
