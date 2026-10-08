import UpgradeButton from '@/components/UpgradeButton';
import DashboardClient from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Prípadné počiatočné dáta alebo volanie API pre správy
  const initialMessages: any[] = [
    // Sem si môžeš doplniť dáta, alebo sa ti načítavajú z backendu
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Pôvodná hlavička dashboardu */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Welcome back, Matias Damborsky!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">damborskymatias@gmail.com</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Nové Stripe Upgrade tlačidlo */}
          <UpgradeButton />

          {/* Tlačidlo pre odhlásenie */}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm rounded-lg transition cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Hlavný obsah s pôvodným DashboardClient komponentom */}
      <main className="p-6 max-w-7xl mx-auto">
        <DashboardClient initialMessages={initialMessages} />
      </main>
    </div>
  );
}
