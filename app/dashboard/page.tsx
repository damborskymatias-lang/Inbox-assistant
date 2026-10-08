import UpgradeButton from '@/components/UpgradeButton';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Welcome back, Matias Damborsky!
          </h1>
          <p className="text-sm text-gray-500">damborskymatias@gmail.com</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stripe Upgrade Button Component */}
          <UpgradeButton />

          {/* Sign Out Button */}
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

      {/* Rest of your dashboard content */}
    </div>
  );
}
