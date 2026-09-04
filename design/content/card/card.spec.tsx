import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Card } from './card.js';
import styles from './card.module.scss';

it('should render the card content', () => {
  const { container } = render(
    <Card>
      <p>Card body content</p>
    </Card>
  );
  const content = container.querySelector(`.${styles.content}`);
  expect(content?.textContent).toBe('Card body content');
});

it('should render the title as an eyebrow label', () => {
  const { container } = render(<Card title="Inbox summary">Body</Card>);
  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe('Inbox summary');
});

it('should not render the header when no title or actions are provided', () => {
  const { container } = render(<Card>Body</Card>);
  const header = container.querySelector(`.${styles.header}`);
  expect(header).toBeFalsy();
});

it('should render the provided actions', () => {
  const handleClick = () => {};
  const { container } = render(
    <Card
      title="Daily summary"
      actions={
        <button type="button" onClick={() => handleClick()}>
          Refresh
        </button>
      }
    >
      Body
    </Card>
  );
  const actions = container.querySelector(`.${styles.actions}`);
  expect(actions?.textContent).toBe('Refresh');
});

it('should apply the padding class name', () => {
  const { container } = render(<Card padding="lg">Body</Card>);
  const card = container.querySelector(`.${styles.card}`);
  expect(card?.className).toContain(styles.paddingLg);
});

it('should apply the tone class name', () => {
  const { container } = render(<Card tone="warning">Body</Card>);
  const card = container.querySelector(`.${styles.card}`);
  expect(card?.className).toContain(styles.toneWarning);
});

it('should apply the interactive class name when enabled', () => {
  const { container } = render(<Card interactive>Body</Card>);
  const card = container.querySelector(`.${styles.card}`);
  expect(card?.className).toContain(styles.interactive);
});

it('should apply a custom class name', () => {
  const { container } = render(<Card className="custom-class">Body</Card>);
  const card = container.querySelector('.custom-class');
  expect(card).toBeTruthy();
});

it('should trigger the actions click handler', () => {
  let clicked = false;
  const { container } = render(
    <Card
      actions={
        <button type="button" onClick={() => { clicked = true; }}>
          Archive
        </button>
      }
    >
      Body
    </Card>
  );
  const button = container.querySelector('button');
  fireEvent.click(button as HTMLButtonElement);
  expect(clicked).toBe(true);
});
