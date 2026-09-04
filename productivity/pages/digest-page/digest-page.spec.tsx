import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { DigestPage } from './digest-page.js';
import styles from './digest-page.module.scss';
import {
  mockDigestPageUser,
  mockTodayDigest,
  mockDigestHistory,
  mockDigestPreferences,
} from './digest-page.mock.js';

describe('DigestPage', () => {
  it('renders the minutes saved headline based on the digest data', () => {
    const { container } = render(
      <MockProvider initialEntries={['/digest']}>
        <DigestPage
          mockUser={mockDigestPageUser()}
          mockDigest={mockTodayDigest()}
          mockHistory={mockDigestHistory()}
          mockPreferences={mockDigestPreferences()}
        />
      </MockProvider>
    );

    const headline = container.querySelector(`.${styles.headlineTitle}`);
    expect(headline?.textContent).toContain('24 minutes today');
  });

  it('renders the notification preferences card', () => {
    const { container, getAllByText } = render(
      <MockProvider initialEntries={['/digest']}>
        <DigestPage
          mockUser={mockDigestPageUser()}
          mockDigest={mockTodayDigest()}
          mockHistory={mockDigestHistory()}
          mockPreferences={mockDigestPreferences()}
        />
      </MockProvider>
    );

    expect(getAllByText('Daily digest').length).toBeGreaterThan(0);
    const fieldsRow = container.querySelector(`.${styles.fieldsRow}`);
    expect(fieldsRow).toBeTruthy();
  });

  it('marks the channel and time fields as disabled when the digest is off', () => {
    const { container } = render(
      <MockProvider initialEntries={['/digest']}>
        <DigestPage
          mockUser={mockDigestPageUser()}
          mockDigest={mockTodayDigest()}
          mockHistory={mockDigestHistory()}
          mockPreferences={{ enabled: false, channel: `push`, timeOfDay: `07:00` }}
        />
      </MockProvider>
    );

    const disabledSection = container.querySelector(`.${styles.sectionDisabled}`);
    expect(disabledSection).toBeTruthy();
  });

  it('shows a saved note after toggling the daily digest', async () => {
    const { container, findByText } = render(
      <MockProvider initialEntries={['/digest']}>
        <DigestPage
          mockUser={mockDigestPageUser()}
          mockDigest={mockTodayDigest()}
          mockHistory={mockDigestHistory()}
          mockPreferences={mockDigestPreferences()}
        />
      </MockProvider>
    );

    const toggle = container.querySelector('button[role="switch"]') as HTMLButtonElement;
    fireEvent.click(toggle);

    const savedNote = await findByText('Preferences saved');
    expect(savedNote).toBeTruthy();
  });

  it('redirects anonymous visitors away from the protected page', () => {
    const { container } = render(
      <MockProvider initialEntries={['/digest']}>
        <DigestPage mockUser={undefined} />
      </MockProvider>
    );

    const headline = container.querySelector(`.${styles.headlineTitle}`);
    expect(headline).toBeNull();
  });
});
