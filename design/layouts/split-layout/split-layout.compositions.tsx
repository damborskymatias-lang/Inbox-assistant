import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { InboxTheme } from '@lov/design.inbox-theme';
import { SplitLayout } from './split-layout.js';

const listItems = [
  { id: '1', sender: 'John Carter', subject: 'Project update for Q3 rollout?', summary: 'Client is requesting a project update before the Thursday steering call.', time: '08:12' },
  { id: '2', sender: 'Revolut Security', subject: 'Action required: verify your identity', summary: 'Your bank requires identity verification within 48 hours.', time: '07:45' },
  { id: '3', sender: 'Amazon', subject: 'Your package has been delayed', summary: 'Delivery of your order moved from Tuesday to Friday.', time: '07:02' },
  { id: '4', sender: 'Lena Fischer', subject: 'Contract review — one open point', summary: 'Legal flagged the liability clause and needs your decision.', time: 'Yesterday' },
];

function SampleList({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {listItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          style={{
            display: 'grid',
            gap: '0.2rem',
            textAlign: 'left',
            width: '100%',
            boxSizing: 'border-box',
            border: `1px solid ${item.id === selectedId ? 'var(--colors-primary-default)' : 'var(--borders-default-color)'}`,
            borderRadius: 'var(--borders-radius-large)',
            padding: '0.75rem 0.9rem',
            background: item.id === selectedId ? 'var(--colors-secondary-default)' : 'var(--colors-surface-primary)',
            cursor: 'pointer',
            fontFamily: 'var(--typography-font-family)',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 'var(--typography-sizes-body-small)', color: 'var(--colors-text-primary)' }}>
            {item.sender}
          </span>
          <span style={{ fontSize: 'var(--typography-sizes-body-small)', color: 'var(--colors-text-default)' }}>
            {item.subject}
          </span>
          <span style={{ fontSize: 'var(--typography-sizes-caption-default)', color: 'var(--colors-text-secondary)' }}>
            {item.summary} · {item.time}
          </span>
        </button>
      ))}
    </div>
  );
}

function SampleDetail({ subject, sender, body }: { subject: string; sender: string; body: string }) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem', padding: '1.1rem', fontFamily: 'var(--typography-font-family)' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 'var(--typography-sizes-heading-h5)', color: 'var(--colors-text-primary)' }}>
          {subject}
        </h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: 'var(--typography-sizes-caption-default)', color: 'var(--colors-text-secondary)' }}>
          {sender}
        </p>
      </div>
      <p
        style={{
          margin: 0,
          borderTop: '1px solid var(--borders-default-color)',
          paddingTop: '0.75rem',
          fontSize: 'var(--typography-sizes-body-small)',
          lineHeight: 'var(--typography-line-height-base)',
          color: 'var(--colors-text-default)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {body}
      </p>
    </div>
  );
}

export const BasicSplitLayout = () => {
  const [selectedId, setSelectedId] = useState('1');
  const selectedItem = listItems.find((item) => item.id === selectedId) || listItems[0];

  return (
    <MemoryRouter>
      <InboxTheme>
        <div style={{ padding: '1.25rem', background: 'var(--colors-surface-background)' }}>
          <SplitLayout
            list={<SampleList selectedId={selectedId} onSelect={setSelectedId} />}
            detail={
              <SampleDetail
                subject={selectedItem.subject}
                sender={selectedItem.sender}
                body={`Hi Peter,\n\n${selectedItem.summary}\n\nBest,\n${selectedItem.sender}`}
              />
            }
          />
        </div>
      </InboxTheme>
    </MemoryRouter>
  );
};

export const WideRatioSplitLayout = () => {
  const [selectedId, setSelectedId] = useState('2');
  const selectedItem = listItems.find((item) => item.id === selectedId) || listItems[0];

  return (
    <MemoryRouter>
      <InboxTheme>
        <div style={{ padding: '1.25rem', background: 'var(--colors-surface-background)' }}>
          <SplitLayout
            ratio={1.8}
            gap="var(--spacing-xl)"
            list={<SampleList selectedId={selectedId} onSelect={setSelectedId} />}
            detail={
              <SampleDetail
                subject={selectedItem.subject}
                sender={selectedItem.sender}
                body={`Hi Peter,\n\n${selectedItem.summary}\n\nBest,\n${selectedItem.sender}`}
              />
            }
          />
        </div>
      </InboxTheme>
    </MemoryRouter>
  );
};

export const NoSelectionSplitLayout = () => {
  return (
    <MemoryRouter>
      <InboxTheme>
        <div style={{ padding: '1.25rem', background: 'var(--colors-surface-background)' }}>
          <SplitLayout
            hasSelection={false}
            list={<SampleList selectedId="" onSelect={() => {}} />}
            detail={<SampleDetail subject="Select an email" sender="" body="Choose an item from the list to see its details here." />}
          />
        </div>
      </InboxTheme>
    </MemoryRouter>
  );
};
