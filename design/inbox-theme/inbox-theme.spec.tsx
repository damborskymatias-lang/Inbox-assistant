import { render } from '@testing-library/react';
import { InboxTheme } from './inbox-theme.js';

it('renders with the correct children', () => {
  const { getByText } = render(<InboxTheme>Hello world!</InboxTheme>);
  const rendered = getByText('Hello world!');
  expect(rendered).toBeTruthy();
});

it('renders dark theme children', () => {
  const { getByText } = render(<InboxTheme initialTheme="dark">Dark mode!</InboxTheme>);
  const rendered = getByText('Dark mode!');
  expect(rendered).toBeTruthy();
});

it('applies a custom class name', () => {
  const { container } = render(<InboxTheme className="custom-inbox-theme">content</InboxTheme>);
  const themeRoot = container.querySelector('.custom-inbox-theme');
  expect(themeRoot).toBeTruthy();
});
