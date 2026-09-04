import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Hero } from './hero.js';
import styles from './hero.module.scss';
import type { HeroPreviewEmail } from './hero-preview-email-type.js';

describe(`Hero`, () => {
  it(`renders the default headline and cta label`, () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    const headline = container.querySelector(`.${styles.headline}`);
    expect(headline?.textContent).toBe(`Process your inbox in minutes, not hours`);

    const button = container.querySelector(`button`);
    expect(button?.textContent).toContain(`Continue with Google`);
  });

  it(`renders custom headline and subheadline props`, () => {
    const { container } = render(
      <MemoryRouter>
        <Hero headline="Custom headline" subheadline="Custom subheadline text" />
      </MemoryRouter>
    );

    const headline = container.querySelector(`.${styles.headline}`);
    const subheadline = container.querySelector(`.${styles.subheadline}`);

    expect(headline?.textContent).toBe(`Custom headline`);
    expect(subheadline?.textContent).toBe(`Custom subheadline text`);
  });

  it(`calls onCtaClick when the primary button is clicked`, () => {
    let clicked = false;
    const { container } = render(
      <MemoryRouter>
        <Hero onCtaClick={() => (clicked = true)} />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`) as HTMLButtonElement;
    button.click();

    expect(clicked).toBe(true);
  });

  it(`renders the provided preview emails`, () => {
    const previewEmails: HeroPreviewEmail[] = [
      {
        id: `p1`,
        sender: `Test Sender`,
        subject: `Test subject`,
        summary: `Test summary`,
        bucket: `urgent`,
        receivedAt: `10:00`,
      },
    ];

    const { container } = render(
      <MemoryRouter>
        <Hero previewEmails={previewEmails} />
      </MemoryRouter>
    );

    const rows = container.querySelectorAll(`.${styles.previewRow}`);
    expect(rows.length).toBe(1);
    expect(container.querySelector(`.${styles.previewSender}`)?.textContent).toBe(`Test Sender`);
  });

  it(`renders the provided stats`, () => {
    const { container } = render(
      <MemoryRouter>
        <Hero stats={[{ value: `42%`, label: `custom stat` }]} />
      </MemoryRouter>
    );

    const statValues = container.querySelectorAll(`.${styles.statValue}`);
    expect(statValues.length).toBe(1);
    expect(statValues[0].textContent).toBe(`42%`);
  });
});
