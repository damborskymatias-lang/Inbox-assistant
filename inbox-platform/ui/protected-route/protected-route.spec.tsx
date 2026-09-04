import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { ProtectedRoute } from './protected-route.js';
import styles from './protected-route.module.scss';

describe('ProtectedRoute', () => {
  it('renders a loading spinner while the auth state resolves', () => {
    const { container } = render(
      <MockProvider mocks={[]} initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MockProvider>
    );

    const loadingScreen = container.querySelector(`.${styles.loadingScreen}`);
    expect(loadingScreen).not.toBeNull();
  });

  it('renders children when a mock authenticated user is provided', () => {
    const { container } = render(
      <MockProvider mocks={[]} initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute mockUser={mockUser()}>
                <div className="protected-content">Dashboard content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MockProvider>
    );

    const content = container.querySelector('.protected-content');
    expect(content).not.toBeNull();
    expect(content?.textContent).toBe(`Dashboard content`);
  });

  it('redirects anonymous users to the login route', async () => {
    const { container } = render(
      <MockProvider mocks={[]} initialEntries={['/dashboard/urgent']}>
        <Routes>
          <Route
            path="/dashboard/urgent"
            element={
              <ProtectedRoute>
                <div>Dashboard content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div className="login-screen">Login page</div>} />
        </Routes>
      </MockProvider>
    );

    await waitFor(() => {
      const loginScreen = container.querySelector('.login-screen');
      expect(loginScreen).not.toBeNull();
    });
  });

  it('redirects anonymous users to a custom redirectTo destination', async () => {
    const { container } = render(
      <MockProvider mocks={[]} initialEntries={['/settings']}>
        <Routes>
          <Route
            path="/settings"
            element={
              <ProtectedRoute redirectTo="/welcome">
                <div>Settings content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/welcome" element={<div className="welcome-screen">Welcome</div>} />
        </Routes>
      </MockProvider>
    );

    await waitFor(() => {
      const welcomeScreen = container.querySelector('.welcome-screen');
      expect(welcomeScreen).not.toBeNull();
    });
  });
});
