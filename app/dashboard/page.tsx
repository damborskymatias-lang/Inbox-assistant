import UpgradeButton from '@/components/UpgradeButton';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header with Upgrade Button */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Welcome back, Matias Damborsky!
          </h1>
          <p className="text-sm text-gray-500">damborskymatias@gmail.com</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stripe Upgrade Button */}
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

      {/* Main Dashboard Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Filters / Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm">All</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Urgent</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Important</button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email List Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="p-3 border border-purple-200 bg-purple-50/50 rounded-lg cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-gray-900">Vercel Notifications</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Urgent</span>
              </div>
              <p className="text-xs text-gray-600 truncate">Production deployment failed for inbox-assistant...</p>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-gray-900">ZUPPA info</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Normal</span>
              </div>
              <p className="text-xs text-gray-600 truncate">Šaty na HALLOWEEN</p>
            </div>
          </div>

          {/* Active Email Detail / AI Actions */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Production deployment failed for inbox-assistant</h2>
                  <p className="text-xs text-gray-500">From: Vercel &lt;notifications@vercel.com&gt;</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2">
                  <span>✨</span> Summarize & AI Actions
                </button>
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                Production deployment failed. Please check your build logs.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
