import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { DigestPage } from './digest-page.js';
import {
  mockDigestPageUser,
  mockTodayDigest,
  mockDigestHistory,
  mockDigestPreferences,
} from './digest-page.mock.js';

export const BasicDigestPage = () => {
  return (
    <MockProvider initialEntries={['/digest']}>
      <DigestPage
        mockUser={mockDigestPageUser()}
        mockDigest={mockTodayDigest()}
        mockHistory={mockDigestHistory()}
        mockPreferences={mockDigestPreferences()}
      />
    </MockProvider>
  );
};

export const DigestDisabledPreferences = () => {
  return (
    <MockProvider initialEntries={['/digest']}>
      <DigestPage
        mockUser={mockDigestPageUser()}
        mockDigest={mockTodayDigest()}
        mockHistory={mockDigestHistory()}
        mockPreferences={{ enabled: false, channel: `push`, timeOfDay: `07:00` }}
      />
    </MockProvider>
  );
};

export const AnonymousVisitorRedirected = () => {
  return (
    <MockProvider initialEntries={['/digest']}>
      <DigestPage
        mockUser={undefined}
        mockDigest={mockTodayDigest()}
        mockHistory={mockDigestHistory()}
        mockPreferences={mockDigestPreferences()}
      />
    </MockProvider>
  );
};
