import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { StatTile } from './stat-tile.js';
import type { StatTileAccent } from './stat-tile.js';

export const TriageSummaryTiles = () => {
  const [active, setActive] = useState<string>(`urgent`);

  const tiles: { key: string; count: number; label: string; emoji: string; accent: StatTileAccent }[] = [
    { key: `urgent`, count: 3, label: `Urgent`, emoji: `🔥`, accent: `urgent` },
    { key: `needsReply`, count: 8, label: `Needs Reply`, emoji: `📄`, accent: `needsReply` },
    { key: `fyi`, count: 14, label: `FYI`, emoji: `✅`, accent: `fyi` },
    { key: `promotions`, count: 42, label: `Promotions`, emoji: `🗑`, accent: `promotions` },
  ];

  return (
    <MockProvider>
      <div
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat(4, minmax(0, 1fr))`,
          gap: `0.75rem`,
          padding: `1.5rem`,
        }}
      >
        {tiles.map((tile) => (
          <StatTile
            key={tile.key}
            count={tile.count}
            label={tile.label}
            emoji={tile.emoji}
            accent={tile.accent}
            selected={active === tile.key}
            onSelect={() => setActive(active === tile.key ? `` : tile.key)}
          />
        ))}
      </div>
    </MockProvider>
  );
};

export const DigestMetricTiles = () => {
  return (
    <MockProvider>
      <div
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,
          gap: `0.75rem`,
          padding: `1.5rem`,
          maxWidth: `480px`,
        }}
      >
        <StatTile count={24} label="Minutes saved" emoji="⏱" accent="brand" />
        <StatTile count={12} label="Replies sent" emoji="📬" accent="fyi" />
        <StatTile count={42} label="Newsletters cleared" emoji="🧹" accent="promotions" />
      </div>
    </MockProvider>
  );
};

export const SingleSelectedTile = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `220px` }}>
        <StatTile count={5} label="Urgent" emoji="🔥" accent="urgent" selected />
      </div>
    </MockProvider>
  );
};
