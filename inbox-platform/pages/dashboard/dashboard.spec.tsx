import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Dashboard } from './dashboard.js';
import styles from './dashboard.module.scss';
import type { DashboardPanel } from './dashboard-panel-type.js';

function PanelA() {
  return <div>Panel A</div>;
}

function PanelB() {
  return <div>Panel B</div>;
}

describe('Dashboard', () => {
  it('renders a greeting with the user first name', () => {
    const { container } = render(
      <MockProvider initialEntries={['/dashboard']}>
        <Dashboard mockUser={mockUser({ name: 'Peter Novak' })} panels={[]} />
      </MockProvider>
    );

    const heading = container.querySelector('h1');
    expect(heading?.textContent).toContain('Peter');
  });

  it('renders an empty state when no panels are registered', () => {
    const { container } = render(
      <MockProvider initialEntries={['/dashboard']}>
        <Dashboard mockUser={mockUser()} panels={[]} />
      </MockProvider>
    );

    const grid = container.querySelector(`.${styles.grid}`);
    expect(grid).toBeNull();
  });

  it('renders panels sorted by weight', () => {
    const panels: DashboardPanel[] = [
      { name: 'b', component: PanelB, weight: 2 },
      { name: 'a', component: PanelA, weight: 1 },
    ];

    const { container } = render(
      <MockProvider initialEntries={['/dashboard']}>
        <Dashboard mockUser={mockUser()} panels={panels} />
      </MockProvider>
    );

    const rendered = container.querySelectorAll(`.${styles.panel}`);
    expect(rendered.length).toBe(2);
    expect(rendered[0].textContent).toContain('Panel A');
    expect(rendered[1].textContent).toContain('Panel B');
  });

  it('applies the full span class for full span panels', () => {
    const panels: DashboardPanel[] = [{ name: 'a', component: PanelA, weight: 1, span: 'full' }];

    const { container } = render(
      <MockProvider initialEntries={['/dashboard']}>
        <Dashboard mockUser={mockUser()} panels={panels} />
      </MockProvider>
    );

    const panel = container.querySelector(`.${styles.panel}`);
    expect(panel?.classList.contains(styles.spanFull)).toBe(true);
  });

  it('applies the half span class by default when no span is provided', () => {
    const panels: DashboardPanel[] = [{ name: 'a', component: PanelA, weight: 1 }];

    const { container } = render(
      <MockProvider initialEntries={['/dashboard']}>
        <Dashboard mockUser={mockUser()} panels={panels} />
      </MockProvider>
    );

    const panel = container.querySelector(`.${styles.panel}`);
    expect(panel?.classList.contains(styles.spanHalf)).toBe(true);
  });
});
