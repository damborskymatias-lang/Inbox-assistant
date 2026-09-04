import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Icon } from './icon.js';

function MailPath() {
  return (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="m4 6 8 7 8-7" />
    </>
  );
}

function StarPath() {
  return (
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  );
}

export const BasicIcon = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
        <Icon title="Mail">
          <MailPath />
        </Icon>
        <Icon size="lg" color="primary" title="Favorite">
          <StarPath />
        </Icon>
        <Icon size={32} color="urgent" title="Urgent">
          <StarPath />
        </Icon>
      </div>
    </MemoryRouter>
  );
};

export const IconSizes = () => {
  const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.5rem' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: '0.35rem' }}>
            <Icon size={size} color="secondary" title={`Star ${size}`}>
              <StarPath />
            </Icon>
            <span style={{ fontSize: '0.7rem', color: 'var(--colors-text-secondary)' }}>{size}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

export const IconTriageColors = () => {
  const colors: Array<{ label: string; color: string }> = [
    { label: 'Urgent', color: 'urgent' },
    { label: 'Needs reply', color: 'needsReply' },
    { label: 'FYI', color: 'fyi' },
    { label: 'Promotions', color: 'promotions' },
  ];
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.5rem' }}>
        {colors.map((item) => (
          <div key={item.label} style={{ display: 'grid', justifyItems: 'center', gap: '0.35rem' }}>
            <Icon size="lg" color={item.color} title={item.label}>
              <MailPath />
            </Icon>
            <span style={{ fontSize: '0.7rem', color: 'var(--colors-text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};
