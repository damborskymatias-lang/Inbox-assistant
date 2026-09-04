import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon } from './home-icon.js';
import { DashboardIcon } from './dashboard-icon.js';
import { CloseIcon } from './close-icon.js';
import { ChevronDownIcon } from './chevron-down-icon.js';

describe('inbox-icons', () => {
  it('should render the home icon with an accessible title', () => {
    const { container } = render(
      <MemoryRouter>
        <HomeIcon title="Home" />
      </MemoryRouter>
    );
    const titleEl = container.querySelector('title');
    expect(titleEl?.textContent).toBe('Home');
  });

  it('should render an svg element with the correct viewBox', () => {
    const { container } = render(
      <MemoryRouter>
        <DashboardIcon title="Dashboard" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should hide decorative icons from assistive tech when no title is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <CloseIcon title="" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply a custom class name', () => {
    const { container } = render(
      <MemoryRouter>
        <ChevronDownIcon className="custom-chevron" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg.custom-chevron');
    expect(svg).toBeTruthy();
  });
});
