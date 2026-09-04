import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeaturesSection } from './features-section.js';
import styles from './features-section.module.scss';

import type { FeatureItem } from './feature-item-type.js';

describe('FeaturesSection', () => {
  it('renders the default title and subtitle', () => {
    const { container } = render(
      <MemoryRouter>
        <FeaturesSection />
      </MemoryRouter>
    );

    const heading = container.querySelector('h2');
    expect(heading?.textContent).toContain('Everything your inbox needed');
  });

  it('renders a card for each default feature', () => {
    const { container } = render(
      <MemoryRouter>
        <FeaturesSection />
      </MemoryRouter>
    );

    const cards = container.querySelectorAll(`.${styles.card}`);
    expect(cards.length).toBe(5);
  });

  it('renders custom features passed via props', () => {
    const customFeatures: FeatureItem[] = [
      {
        icon: `🔍`,
        title: `Semantic search`,
        description: `Find any email in seconds.`,
        highlight: `Search by meaning`,
      },
    ];

    const { container } = render(
      <MemoryRouter>
        <FeaturesSection features={customFeatures} />
      </MemoryRouter>
    );

    const cards = container.querySelectorAll(`.${styles.card}`);
    expect(cards.length).toBe(1);

    const title = container.querySelector('h3');
    expect(title?.textContent).toContain('Semantic search');
  });

  it('applies a custom className to the section root', () => {
    const { container } = render(
      <MemoryRouter>
        <FeaturesSection className="custom-class" />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('custom-class');
  });
});
