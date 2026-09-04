import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';

export const BasicLogo = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem' }}>
        <Logo />
      </div>
    </MemoryRouter>
  );
};

export const LogoSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        <Logo size="sm" />
        <Logo size="md" />
        <Logo size="lg" />
      </div>
    </MemoryRouter>
  );
};

export const GlyphOnlyLogo = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', alignItems: 'center' }}>
        <Logo showWordmark={false} size="sm" />
        <Logo showWordmark={false} size="md" />
        <Logo showWordmark={false} size="lg" />
      </div>
    </MemoryRouter>
  );
};

export const LinkedLogoInHeader = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.9rem 1.25rem',
          background: '#ffffff',
          borderBottom: '1px solid #e6e9f0',
        }}
      >
        <Logo href="/dashboard" />
        <span style={{ fontSize: '0.8rem', color: '#5b6478' }}>Signed in as Peter Cole</span>
      </div>
    </MemoryRouter>
  );
};
