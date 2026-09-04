import { useTheme } from './inbox-theme-provider.js';
import { InboxTheme } from './inbox-theme.js';
import { TokenViewer } from '@bitdesign/sparks.sparks-theme';

function ViewTokens() {
  const theme = useTheme();

  return <TokenViewer theme={theme} />;
}

export const LightTheme = () => {
  return (
    <InboxTheme>
      <ViewTokens />
    </InboxTheme>
  );
};

export const DarkTheme = () => {
  return (
    <InboxTheme initialTheme="dark">
      <ViewTokens />
    </InboxTheme>
  );
};

export const BrandBook = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
        <div>
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--colors-text-secondary)',
              margin: '0 0 0.75rem',
            }}
          >
            Inbox Assistant — Brand Book
          </p>
          <h1
            style={{
              fontFamily: 'var(--typography-font-family)',
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem',
              color: 'var(--colors-text-primary)',
            }}
          >
            Clarity for a calmer inbox
          </h1>
          <p
            style={{
              fontFamily: 'var(--typography-font-family)',
              fontSize: '0.9rem',
              color: 'var(--colors-text-secondary)',
              maxWidth: '520px',
            }}
          >
            The Inbox theme provides the color, type and spacing tokens used across the AI inbox
            assistant: a calm, confident indigo brand paired with clear semantic triage colors.
          </p>
        </div>

        <div>
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--colors-text-secondary)',
              margin: '0 0 0.75rem',
            }}
          >
            Brand colors
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Brand', color: 'var(--colors-primary-default)' },
              { label: 'Brand hover', color: 'var(--colors-primary-hover)' },
              { label: 'Brand soft', color: 'var(--colors-secondary-default)' },
              { label: 'Ink', color: 'var(--colors-text-primary)' },
              { label: 'Ink soft', color: 'var(--colors-text-secondary)' },
            ].map((swatch) => (
              <div key={swatch.label} style={{ display: 'grid', gap: '0.35rem', width: '120px' }}>
                <div
                  style={{
                    height: '64px',
                    borderRadius: 'var(--borders-radius-large)',
                    background: swatch.color,
                    border: '1px solid var(--borders-default-color)',
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--colors-text-secondary)' }}>
                  {swatch.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--colors-text-secondary)',
              margin: '0 0 0.75rem',
            }}
          >
            Triage colors
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Urgent', color: 'var(--colors-triage-urgent-default)' },
              { label: 'Needs reply', color: 'var(--colors-triage-needs-reply-default)' },
              { label: 'FYI', color: 'var(--colors-triage-fyi-default)' },
              { label: 'Promotions', color: 'var(--colors-triage-promotions-default)' },
            ].map((swatch) => (
              <div key={swatch.label} style={{ display: 'grid', gap: '0.35rem', width: '120px' }}>
                <div
                  style={{
                    height: '64px',
                    borderRadius: 'var(--borders-radius-large)',
                    background: swatch.color,
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--colors-text-secondary)' }}>
                  {swatch.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--colors-text-secondary)',
              margin: '0 0 0.75rem',
            }}
          >
            Typography scale
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--typography-font-family)',
                fontSize: 'var(--typography-sizes-display-large)',
                fontWeight: 700,
                letterSpacing: 'var(--typography-letter-spacing-tight)',
              }}
            >
              Daily summary
            </span>
            <span
              style={{
                fontFamily: 'var(--typography-font-family)',
                fontSize: 'var(--typography-sizes-heading-h2)',
                fontWeight: 700,
                letterSpacing: 'var(--typography-letter-spacing-tight)',
              }}
            >
              You have 3 urgent emails
            </span>
            <span
              style={{
                fontFamily: 'var(--typography-font-family)',
                fontSize: 'var(--typography-sizes-body-default)',
                fontWeight: 400,
              }}
            >
              Body copy uses a comfortable reading size with relaxed line height.
            </span>
            <span
              style={{
                fontFamily: 'var(--typography-font-family)',
                fontSize: 'var(--typography-sizes-caption-default)',
                color: 'var(--colors-text-secondary)',
              }}
            >
              Caption text for metadata and timestamps
            </span>
          </div>
        </div>
      </div>
    </InboxTheme>
  );
};
