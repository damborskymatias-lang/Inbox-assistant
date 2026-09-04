import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BillingIcons } from './billing-icons.js';
import { CrownIcon } from './crown-icon.js';
import { LockIcon } from './lock-icon.js';
import { CheckIcon } from './check-icon.js';
import { BoltIcon } from './bolt-icon.js';
import { CreditCardIcon } from './credit-card-icon.js';

export const BasicBillingIcons = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem' }}>
        <BillingIcons />
      </div>
    </MemoryRouter>
  );
};

export const IndividualIcons = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem' }}>
        <CrownIcon size="lg" color="warning" />
        <LockIcon size="lg" color="muted" />
        <CheckIcon size="lg" color="positive" />
        <BoltIcon size="lg" color="primary" />
        <CreditCardIcon size="lg" color="secondary" />
      </div>
    </MemoryRouter>
  );
};

export const FeatureListWithIcons = () => {
  const features: Array<{ label: string; included: boolean }> = [
    { label: 'Unlimited AI replies', included: true },
    { label: 'Priority processing', included: true },
    { label: 'Custom writing styles', included: false },
    { label: 'Team seats', included: false },
  ];

  return (
    <MemoryRouter>
      <div style={{ padding: '1.5rem', maxWidth: '320px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CrownIcon size="md" color="warning" />
          <strong style={{ fontFamily: 'var(--typography-font-family)' }}>Pro plan</strong>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.6rem' }}>
          {features.map((feature) => (
            <li key={feature.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {feature.included ? (
                <CheckIcon size="sm" color="positive" />
              ) : (
                <LockIcon size="sm" color="muted" />
              )}
              <span style={{ fontFamily: 'var(--typography-font-family)', fontSize: '0.85rem' }}>
                {feature.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </MemoryRouter>
  );
};
