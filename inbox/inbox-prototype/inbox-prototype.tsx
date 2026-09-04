import { Routes, Route } from 'react-router-dom';
import { InboxTheme } from '@lov/design.inbox-theme';
import { LoginPage } from './login-page.js';
import { DashboardPage } from './dashboard-page.js';

/**
 * Root of the AI Inbox Assistant prototype — sign-in and dashboard routes,
 * rendered inside the inbox design system theme.
 */
export function InboxPrototype() {
  return (
    <InboxTheme>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </InboxTheme>
  );
}
