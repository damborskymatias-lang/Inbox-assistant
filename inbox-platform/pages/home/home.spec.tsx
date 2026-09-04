import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Home } from './home.js';
import styles from './home.module.scss';

describe('Home', () => {
  it('renders the marketing homepage for anonymous visitors', async () => {
    const { container } = render(
      <MockProvider>
        <Home />
      </MockProvider>
    );

    await waitFor(() => {
      expect(container.querySelector('h1')).toBeTruthy();
    });

    const heading = container.querySelector('h1');
    expect(heading?.textContent).toContain('Process your inbox in minutes, not hours');
  });

  it('renders the dashboard for authenticated users', async () => {
    const { container } = render(
      <MockProvider initialEntries={['/']}>
        <Home mockUser={mockUser({ name: 'Peter Novak' })} />
      </MockProvider>
    );

    await waitFor(() => {
      expect(container.querySelector('h1')).toBeTruthy();
    });

    const heading = container.querySelector('h1');
    expect(heading?.textContent).toContain('Peter');
  });

  it('applies the provided class name to the root element', async () => {
    const { container } = render(
      <MockProvider>
        <Home className="custom-class" />
      </MockProvider>
    );

    await waitFor(() => {
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });
  });

  it('renders dashboard panels for authenticated users', async () => {
    function CustomPanel() {
      return <div>Custom panel content</div>;
    }

    const { container } = render(
      <MockProvider initialEntries={['/']}>
        <Home
          mockUser={mockUser()}
          dashboardPanels={[{ name: 'custom', component: CustomPanel, weight: 1, span: 'full' }]}
        />
      </MockProvider>
    );

    await waitFor(() => {
      expect(container.textContent).toContain('Custom panel content');
    });
  });

  it('does not render a loading spinner once auth has resolved for an anonymous user', async () => {
    const { container } = render(
      <MockProvider>
        <Home />
      </MockProvider>
    );

    await waitFor(() => {
      expect(container.querySelector(`.${styles.spinner}`)).toBeNull();
    });
  });
});
