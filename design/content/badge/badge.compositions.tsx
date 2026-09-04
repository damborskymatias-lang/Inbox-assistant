import React from 'react';
import { InboxTheme } from '@lov/design.inbox-theme';
import { Badge } from './badge.js';

export const CategoryBadges = () => {
  return (
    <InboxTheme>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1.5rem', flexWrap: 'wrap' }}>
        <Badge tone="urgent" icon="🔴">
          Urgent
        </Badge>
        <Badge tone="work" icon="💼">
          Work
        </Badge>
        <Badge tone="bills" icon="💰">
          Bills
        </Badge>
        <Badge tone="shopping" icon="🛒">
          Shopping
        </Badge>
        <Badge tone="family" icon="👨‍👩‍👧">
          Family
        </Badge>
        <Badge tone="marketing" icon="📢">
          Marketing
        </Badge>
      </div>
    </InboxTheme>
  );
};

export const StatusAndImportance = () => {
  return (
    <InboxTheme>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge tone="success">Sent</Badge>
        <Badge tone="brand">New</Badge>
        <Badge tone="neutral">importance 8/10</Badge>
        <Badge tone="urgent" size="xs">
          9/10
        </Badge>
      </div>
    </InboxTheme>
  );
};

export const SizesComparison = () => {
  return (
    <InboxTheme>
      <div style={{ display: 'flex', gap: '0.75rem', padding: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge tone="work" size="xs" icon="💼">
          Work
        </Badge>
        <Badge tone="work" size="sm" icon="💼">
          Work
        </Badge>
      </div>
    </InboxTheme>
  );
};
