import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from './link.js';

export const BasicLinks = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/inbox">Inbox</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </MemoryRouter>
  );
};

export const ActiveAndUnderlinedLinks = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
        <Link href="/dashboard" active>
          Dashboard
        </Link>
        <Link href="/inbox" underline>
          Inbox
        </Link>
        <Link href="/settings" active underline>
          Settings
        </Link>
      </div>
    </MemoryRouter>
  );
};

export const ExternalLink = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
        <Link href="https://bit.dev" external>
          Bit.dev
        </Link>
        <Link href="https://docs.bit.dev" external underline>
          Documentation
        </Link>
      </div>
    </MemoryRouter>
  );
};
