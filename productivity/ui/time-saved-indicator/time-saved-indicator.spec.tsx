import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { TimeSavedIndicator } from './time-saved-indicator.js';
import styles from './time-saved-indicator.module.scss';

const mockDigest = {
  id: `digest-test`,
  userId: `user-test`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 24,
};

it('should render the full time saved label', () => {
  const { container } = render(
    <MemoryRouter>
      <MockedProvider>
        <TimeSavedIndicator digest={mockDigest} />
      </MockedProvider>
    </MemoryRouter>
  );

  const label = container.querySelector(`.${styles.fullLabel}`);
  expect(label?.textContent).toBe(`You saved ~24 minutes today`);
});

it('should not show the breakdown popover before it is clicked', () => {
  const { container } = render(
    <MemoryRouter>
      <MockedProvider>
        <TimeSavedIndicator digest={mockDigest} />
      </MockedProvider>
    </MemoryRouter>
  );

  const popover = container.querySelector(`.${styles.popover}`);
  expect(popover).toBeNull();
});

it('should open the breakdown popover with replies, cleaned and triaged counts when clicked', () => {
  const { container, getByText } = render(
    <MemoryRouter>
      <MockedProvider>
        <TimeSavedIndicator digest={mockDigest} />
      </MockedProvider>
    </MemoryRouter>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);

  const popover = container.querySelector(`.${styles.popover}`);
  expect(popover).toBeTruthy();
  expect(getByText(`4`)).toBeTruthy();
  expect(getByText(`42`)).toBeTruthy();
  expect(getByText(`38`)).toBeTruthy();
});

it('should render a link to the full digest', () => {
  const { container } = render(
    <MemoryRouter>
      <MockedProvider>
        <TimeSavedIndicator digest={mockDigest} digestHref="/dashboard/digest" />
      </MockedProvider>
    </MemoryRouter>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);

  const link = container.querySelector(`.${styles.digestLink}`) as HTMLAnchorElement;
  expect(link).toBeTruthy();
  expect(link.getAttribute('href')).toBe('/dashboard/digest');
});
