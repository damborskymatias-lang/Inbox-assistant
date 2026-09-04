import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AllAssistantIcons, AssistantIconSizes, AssistantActionsExample } from './assistant-icons.compositions.js';
import { SparklesIcon } from './sparkles-icon.js';

it('should render all assistant icons', () => {
  const { container } = render(<AllAssistantIcons />);
  const svgs = container.querySelectorAll('svg');
  expect(svgs.length).toBe(6);
});

it('should render each icon with the correct accessible title', () => {
  const { container } = render(<AllAssistantIcons />);
  const titles = Array.from(container.querySelectorAll('svg title')).map((node) => node.textContent);
  expect(titles).toEqual([
    'Generate with AI',
    'Magic action',
    'AI understanding',
    'Daily summary',
    'Regenerate',
    'Writing style',
  ]);
});

it('should render icons at different sizes', () => {
  const { container } = render(<AssistantIconSizes />);
  const svgs = container.querySelectorAll('svg');
  expect(svgs.length).toBe(4);
});

it('should render action buttons with icon and label', () => {
  const { container } = render(<AssistantActionsExample />);
  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toBe(3);
});

it('should apply a custom className to the icon svg', () => {
  const { container } = render(
    <MemoryRouter>
      <SparklesIcon className="custom-class" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.classList.contains('custom-class')).toBe(true);
});
