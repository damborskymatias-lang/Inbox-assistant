import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StopwatchIcon } from './stopwatch-icon.js';
import { TrendUpIcon } from './trend-up-icon.js';
import { DigestIcon } from './digest-icon.js';
import { BellIcon } from './bell-icon.js';
import { TargetIcon } from './target-icon.js';

describe('productivity-icons', () => {
  it('should render the stopwatch icon with an accessible title', () => {
    const { container } = render(
      <MemoryRouter>
        <StopwatchIcon title="Stopwatch" />
      </MemoryRouter>
    );
    const titleEl = container.querySelector('title');
    expect(titleEl?.textContent).toBe('Stopwatch');
  });

  it('should render an svg element with the correct viewBox', () => {
    const { container } = render(
      <MemoryRouter>
        <TrendUpIcon title="Trend up" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should hide decorative icons from assistive tech when no title is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <DigestIcon title="" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply a custom class name to the bell icon', () => {
    const { container } = render(
      <MemoryRouter>
        <BellIcon className="custom-bell" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg.custom-bell');
    expect(svg).toBeTruthy();
  });

  it('should render the target icon by default with a title', () => {
    const { container } = render(
      <MemoryRouter>
        <TargetIcon />
      </MemoryRouter>
    );
    const titleEl = container.querySelector('title');
    expect(titleEl?.textContent).toBe('Target');
  });
});
