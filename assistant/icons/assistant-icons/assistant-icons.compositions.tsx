import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SparklesIcon } from './sparkles-icon.js';
import { WandIcon } from './wand-icon.js';
import { BrainIcon } from './brain-icon.js';
import { SummaryIcon } from './summary-icon.js';
import { RegenerateIcon } from './regenerate-icon.js';
import { StyleIcon } from './style-icon.js';

export const AllAssistantIcons = () => {
  const icons: Array<{ label: string; node: React.ReactNode }> = [
    { label: 'Sparkles', node: <SparklesIcon /> },
    { label: 'Wand', node: <WandIcon /> },
    { label: 'Brain', node: <BrainIcon /> },
    { label: 'Summary', node: <SummaryIcon /> },
    { label: 'Regenerate', node: <RegenerateIcon /> },
    { label: 'Style', node: <StyleIcon /> },
  ];

  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        {icons.map((item) => (
          <div key={item.label} style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem' }}>
            {item.node}
            <span style={{ fontSize: '0.75rem', color: 'var(--colors-text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

export const AssistantIconSizes = () => {
  const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: '0.35rem' }}>
            <SparklesIcon size={size} color="primary" title={`Sparkles ${size}`} />
            <span style={{ fontSize: '0.7rem', color: 'var(--colors-text-secondary)' }}>{size}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

export const AssistantActionsExample = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            borderRadius: 'var(--borders-radius-medium)',
            border: '1px solid var(--borders-default-color)',
            background: 'var(--colors-surface-primary)',
            color: 'var(--colors-text-default)',
            cursor: 'pointer',
          }}
        >
          <SparklesIcon size="sm" color="primary" />
          Generate Reply
        </button>
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            borderRadius: 'var(--borders-radius-medium)',
            border: '1px solid var(--borders-default-color)',
            background: 'var(--colors-surface-primary)',
            color: 'var(--colors-text-default)',
            cursor: 'pointer',
          }}
        >
          <RegenerateIcon size="sm" />
          Regenerate
        </button>
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            borderRadius: 'var(--borders-radius-medium)',
            border: '1px solid var(--borders-default-color)',
            background: 'var(--colors-surface-primary)',
            color: 'var(--colors-text-default)',
            cursor: 'pointer',
          }}
        >
          <StyleIcon size="sm" />
          Writing Style
        </button>
      </div>
    </MemoryRouter>
  );
};
