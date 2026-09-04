import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BroomIcon } from './broom-icon.js';
import { BoxArchiveIcon } from './box-archive-icon.js';
import { TrashBulkIcon } from './trash-bulk-icon.js';
import { NewsletterIcon } from './newsletter-icon.js';
import { SparkleCleanIcon } from './sparkle-clean-icon.js';

describe('cleanup-icons', () => {
  it('should render the broom icon with an accessible title', () => {
    const { container } = render(
      <MemoryRouter>
        <BroomIcon title="Cleanup" />
      </MemoryRouter>
    );
    const titleEl = container.querySelector('title');
    expect(titleEl?.textContent).toBe('Cleanup');
  });

  it('should render an svg element with the correct viewBox', () => {
    const { container } = render(
      <MemoryRouter>
        <BoxArchiveIcon title="Archive" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should hide decorative icons from assistive tech when no title is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <TrashBulkIcon title="" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply a custom class name', () => {
    const { container } = render(
      <MemoryRouter>
        <NewsletterIcon className="custom-newsletter" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg.custom-newsletter');
    expect(svg).toBeTruthy();
  });

  it('should render the sparkle clean icon with a default title', () => {
    const { container } = render(
      <MemoryRouter>
        <SparkleCleanIcon />
      </MemoryRouter>
    );
    const titleEl = container.querySelector('title');
    expect(titleEl?.textContent).toBe('Clean');
  });
});
