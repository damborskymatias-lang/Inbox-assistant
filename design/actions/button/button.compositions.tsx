import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './button.js';

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L9.4 6.1L14.5 7.5L9.4 8.9L8 14L6.6 8.9L1.5 7.5L6.6 6.1L8 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Variants = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <Button variant="primary">Generate Reply</Button>
        <Button variant="secondary">Regenerate</Button>
        <Button variant="ghost">Discard</Button>
        <Button variant="danger">Archive all</Button>
      </div>
    </MemoryRouter>
  );
};

export const SizesAndStates = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', padding: '1.5rem' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button loading>Sending</Button>
        <Button disabled>Disabled</Button>
      </div>
    </MemoryRouter>
  );
};

export const IconsLinksAndFullWidth = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '320px', padding: '1.5rem' }}>
        <Button variant="primary" iconStart={<SparkleIcon />}>
          Generate Reply
        </Button>
        <Button variant="secondary" iconEnd={<ArrowIcon />}>
          Continue
        </Button>
        <Button href="/dashboard" variant="primary" fullWidth>
          Go to Dashboard
        </Button>
      </div>
    </MemoryRouter>
  );
};
