import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IconButton } from './icon-button.js';

export const VariantsAndSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <IconButton icon="🗂" label="Archive email" variant="ghost" />
        <IconButton icon="🗑" label="Delete email" variant="danger" />
        <IconButton icon="⋯" label="More actions" variant="secondary" />
        <IconButton icon="🗂" label="Archive email" size="sm" variant="ghost" />
        <IconButton icon="🗑" label="Delete email" size="sm" variant="danger" />
        <IconButton icon="⋯" label="More actions" size="sm" variant="secondary" />
      </div>
    </MemoryRouter>
  );
};

export const ActiveAndDisabledStates = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1.5rem' }}>
        <IconButton icon="⋯" label="More actions" active />
        <IconButton icon="🗂" label="Archive email" disabled />
        <IconButton icon="🗑" label="Delete email" variant="danger" disabled />
      </div>
    </MemoryRouter>
  );
};

export const EmailRowActions = () => {
  const [archived, setArchived] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          maxWidth: '420px',
          padding: '0.75rem 1rem',
          border: '1px solid #e6e9f0',
          borderRadius: '12px',
          fontFamily: 'sans-serif',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Priya Shah</div>
          <div style={{ fontSize: '0.8rem', color: '#5b6478' }}>
            {archived ? `Archived` : `Q3 roadmap review`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <IconButton
            icon="🗂"
            label="Archive email"
            size="sm"
            active={archived}
            onClick={() => setArchived(!archived)}
          />
          <IconButton icon="🗑" label="Delete email" size="sm" variant="danger" />
          <IconButton
            icon="⋯"
            label="More actions"
            size="sm"
            variant="secondary"
            active={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>
    </MemoryRouter>
  );
};
