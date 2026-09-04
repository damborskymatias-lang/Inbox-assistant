import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { ProtectedRoute } from './protected-route.js';

export const AuthenticatedUserSeesContent = () => {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute mockUser={mockUser()}>
              <div style={{ padding: '2rem' }}>
                <h2>Welcome back, Peter!</h2>
                <p>This content is only visible to authenticated users.</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div style={{ padding: '2rem' }}>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

export const AnonymousUserIsRedirected = () => {
  return (
    <MemoryRouter initialEntries={['/dashboard/urgent']}>
      <Routes>
        <Route
          path="/dashboard/urgent"
          element={
            <ProtectedRoute mockUser={undefined}>
              <div style={{ padding: '2rem' }}>This should not be visible</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <div style={{ padding: '2rem' }}>Redirected to login, preserving attempted path</div>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

export const CustomRedirectDestination = () => {
  return (
    <MemoryRouter initialEntries={['/settings']}>
      <Routes>
        <Route
          path="/settings"
          element={
            <ProtectedRoute redirectTo="/welcome" mockUser={undefined}>
              <div style={{ padding: '2rem' }}>Settings content</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/welcome"
          element={<div style={{ padding: '2rem' }}>Welcome screen (custom redirect)</div>}
        />
      </Routes>
    </MemoryRouter>
  );
};
