import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MailIcons } from './mail-icons.js';
import { InboxIcon } from './inbox-icon.js';
import { FlameIcon } from './flame-icon.js';

describe('MailIcons', () => {
  it('renders the inbox icon when name is inbox', () => {
    const { container } = render(
      <MemoryRouter>
        <MailIcons name="inbox" title="Inbox" />
      </MemoryRouter>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders the accessible title for the icon', () => {
    const { container } = render(
      <MemoryRouter>
        <MailIcons name="urgent" title="Urgent" />
      </MemoryRouter>
    );

    const title = container.querySelector('title');
    expect(title?.textContent).toBe('Urgent');
  });

  it('renders a presentation role when no title is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <MailIcons name="sync" />
      </MemoryRouter>
    );

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('presentation');
  });
});

describe('InboxIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(
      <MemoryRouter>
        <InboxIcon title="Inbox" />
      </MemoryRouter>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});

describe('FlameIcon', () => {
  it('applies a custom class name', () => {
    const { container } = render(
      <MemoryRouter>
        <FlameIcon className="custom-flame" title="Urgent" />
      </MemoryRouter>
    );

    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('custom-flame')).toBe(true);
  });
});
