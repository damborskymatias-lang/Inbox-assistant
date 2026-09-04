import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { InboxTheme } from '@lov/design.inbox-theme';
import { CategoryChip } from './category-chip.js';
import { ImportanceBadge } from './importance-badge.js';

export const AllCategories = () => {
  return (
    <MemoryRouter>
      <InboxTheme>
        <div style={{ display: `flex`, gap: `0.5rem`, padding: `1.5rem`, flexWrap: `wrap` }}>
          <CategoryChip category="urgent" />
          <CategoryChip category="work" />
          <CategoryChip category="bills" />
          <CategoryChip category="shopping" />
          <CategoryChip category="family" />
          <CategoryChip category="marketing" />
        </div>
      </InboxTheme>
    </MemoryRouter>
  );
};

export const ImportanceEscalation = () => {
  return (
    <MemoryRouter>
      <InboxTheme>
        <div style={{ display: `flex`, gap: `0.5rem`, padding: `1.5rem`, flexWrap: `wrap`, alignItems: `center` }}>
          <ImportanceBadge score={2} />
          <ImportanceBadge score={5} />
          <ImportanceBadge score={7} />
          <ImportanceBadge score={9} />
          <ImportanceBadge score={10} />
        </div>
      </InboxTheme>
    </MemoryRouter>
  );
};

export const InEmailRow = () => {
  return (
    <MemoryRouter>
      <InboxTheme>
        <div
          style={{
            display: `flex`,
            gap: `1.5rem`,
            padding: `1.5rem`,
            alignItems: `center`,
            justifyContent: `space-between`,
            maxWidth: `420px`,
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>John Carter</div>
            <div style={{ fontSize: `0.85rem`, color: `var(--colors-text-secondary)` }}>
              Project update for Q3 rollout?
            </div>
          </div>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `0.35rem`, alignItems: `flex-end` }}>
            <CategoryChip category="work" size="xs" />
            <ImportanceBadge score={9} size="xs" />
          </div>
        </div>
      </InboxTheme>
    </MemoryRouter>
  );
};
