/**
 * Inbox theme tokens.
 * Include all tokens in this object.
 */
export function inboxTokens() {
  const tokens = {
    /**
     * Color Palette
     */
    colors: {
      primary: {
        default: '#4f46e5', // Brand indigo
        hover: '#4338ca', // Brand indigo hover
        active: '#3730a3', // Brand indigo active/pressed
      },
      secondary: {
        default: '#eef2ff', // Brand soft surface
        hover: '#e0e7ff', // Brand soft surface hover
        active: '#d6dffe', // Brand soft surface active
      },
      surface: {
        background: '#f6f7fb', // App background
        primary: '#ffffff', // Card / panel surface
        secondary: '#f4f5f9', // Chips, subtle surfaces
      },
      text: {
        primary: '#0f1729', // Ink
        default: '#0f1729', // Ink
        secondary: '#5b6478', // Ink soft
        muted: '#8b8fa3', // Ink muted
        inverse: '#ffffff', // Text on brand / dark surfaces
      },
      status: {
        positive: { default: '#116b3c', subtle: '#ecfdf3' }, // Success
        negative: { default: '#e5484d', subtle: '#fde8e8' }, // Urgent / errors
        warning: { default: '#92531b', subtle: '#fffaf0' }, // Warning
        info: { default: '#4f46e5', subtle: '#eef2ff' }, // Informational
      },
      triage: {
        urgent: { default: '#e5484d', subtle: '#fde8e8' },
        needsReply: { default: '#f5a524', subtle: '#fef3dc' },
        fyi: { default: '#17a34a', subtle: '#e6f7ec' },
        promotions: { default: '#8b8fa3', subtle: '#eef0f4' },
      },
      overlay: 'rgba(15, 23, 41, 0.5)', // Semi-transparent overlay (modals, etc.)
    },

    borders: {
      default: {
        color: '#e6e9f0', // Subtle border color
        width: '1px', // Default border width
        style: 'solid', // Default border style
      },
      focus: {
        color: '#4f46e5', // Focus indicator
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

    /**
     * Typography System
     */
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      sizes: {
        display: { large: '2rem', medium: '1.75rem', small: '1.5rem' },
        heading: {
          h1: '1.5rem',
          h2: '1.35rem',
          h3: '1.2rem',
          h4: '1.05rem',
          h5: '0.95rem',
          h6: '0.85rem',
        },
        body: { large: '1rem', medium: '0.92rem', default: '0.9rem', small: '0.82rem' },
        caption: { default: '0.72rem', medium: '0.78rem' },
      },
      lineHeight: {
        base: '1.5',
        heading: '1.2',
      },
      fontWeight: {
        regular: '400',
        medium: '600',
        semiBold: '600',
        bold: '700',
      },
      letterSpacing: {
        tight: '-0.02em', // For headings
        normal: '0',
        wide: '0.08em', // For eyebrow / uppercase labels
      },
    },

    /**
     * Spacing & Layout
     */
    spacing: {
      default: '0.75rem',
      medium: '0.75rem',
      small: '0.25rem',
      large: '1.25rem',
      xl: '2rem',
      x4: '3rem',
    },

    layout: {
      /**
       * Maximum width size for pages
       */
      maxPageWidth: '1240px',

      /**
       * Spacing between columns or elements
       */
      gutter: '1.25rem',
    },

    /**
     * Visual Effects
     */
    effects: {
      shadows: {
        xs: '0 1px 2px rgba(15, 23, 41, 0.06)', // Extra small soft shadow
        small: '0 1px 2px rgba(15, 23, 41, 0.06), 0 1px 1px rgba(15, 23, 41, 0.04)', // Soft shadow
        medium: '0 8px 20px rgba(15, 23, 41, 0.07)', // Soft elevated shadow
        large: '0 12px 28px rgba(15, 23, 41, 0.1)',
        xLarge: '0 20px 40px rgba(15, 23, 41, 0.14)',
        inset: 'inset 0px 1px 2px rgba(15, 23, 41, 0.08)',
        raised: '0 4px 12px rgba(15, 23, 41, 0.1), 0 2px 4px rgba(15, 23, 41, 0.06)',
      },
      opacity: { disabled: '0.5', hover: '0.8', faint: '0.2', semiOpaque: '0.7' },
      gradients: {
        primary: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
        secondary: 'linear-gradient(to bottom, #eef2ff, #f6f7fb)',
        radial: 'radial-gradient(circle, #4f46e5, #3730a3)',
      },
      blur: {
        small: 'blur(4px)',
        medium: 'blur(8px)',
        large: 'blur(16px)',
      },
    },

    /**
     * Interaction & Motion
     */
    interactions: {
      cursor: { pointer: 'pointer', disabled: 'not-allowed', text: 'text', grab: 'grab', grabbing: 'grabbing' },
      zIndex: { base: '1', modal: '100', tooltip: '200', overlay: '300', sticky: '50' },
      gradients: {
        primary: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
        secondary: 'linear-gradient(135deg, #4338ca, #6366f1)',
        subtle: 'linear-gradient(to bottom, rgba(246, 247, 251, 0.9), rgba(238, 242, 255, 0.6))',
        codeBlock: 'linear-gradient(to right, rgba(244, 245, 249, 1), rgba(238, 242, 255, 1))',
      },
      transitions: {
        duration: { fast: '0.12s', medium: '0.3s', slow: '0.5s', verySlow: '1s' },
        easing: {
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeOut: 'ease-out',
          easeIn: 'ease-in',
          spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        property: {
          all: 'all',
          transform: 'transform',
          opacity: 'opacity',
          color: 'color',
          shadow: 'box-shadow',
        },
      },
      hoverEffect: {
        scale: 'scale(1.02)',
        translateY: 'translateY(-2px)',
        shadow: '0 8px 20px rgba(15, 23, 41, 0.07)',
      },
    },
  };

  return tokens;
}

// create a theme type schema to allow new theme to override
// or implement a different theme variation like dark theme.
/**
 * Use tokens from this schema as css variables in your components.
 * For example, use `backgroundColor` as css variable `--background-color`
 */
export type InboxThemeSchema = ReturnType<typeof inboxTokens>;
