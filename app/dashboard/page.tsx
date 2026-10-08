'use client';

import { useState } from 'react';

export default function DashboardHeader({ user }: { user: { name?: string | null; email?: string | null } }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Chyba pri presmerovaní na Stripe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Welcome back, {user?.name || 'Matias Damborsky'}!
        </h1>
        <p className="text-sm text-gray-500">{user?.email || 'damborskymatias@gmail.com'}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Tlačidlo na predplatné Stripe */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm rounded-lg shadow-sm hover:from-purple-700 hover:to-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          <span>⚡</span>
          {loading ? 'Načítavam...' : 'Upgrade to Pro'}
        </button>

        {/* Tlačidlo pre odhlásenie */}
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-lg transition"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
