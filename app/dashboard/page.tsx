import UpgradeButton from '@/components/UpgradeButton';
import DashboardClient from '@/components/DashboardClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function fetchMessages(accessToken?: string) {
  if (!accessToken) return [];
  try {
    const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const messagesMeta = listData.messages || [];

    // Fetch details for each message to get subject, sender, date, etc.
    const detailedMessages = await Promise.all(
      messagesMeta.map(async (msg: { id: string }) => {
        try {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: 'no-store',
          });
          if (!detailRes.ok) return null;
          const detailData = await detailRes.json();
          
          const headers = detailData.payload?.headers || [];
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
          const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown Sender';
          const date = headers.find((h: any) => h.name === 'Date')?.value || '';

          return {
            id: msg.id,
            subject,
            from,
            date,
            priority: 'Normal', // Default fallback priority
            bodyText: detailData.snippet || 'No preview available.',
          };
        } catch {
          return null;
        }
      })
    );

    return detailedMessages.filter(Boolean);
  } catch (error) {
    console.error('Error fetching messages in dashboard:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const session: any = await getServerSession(authOptions);
  const initialMessages = await fetchMessages(session?.accessToken);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Dashboard Header with Stripe Upgrade Button */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Welcome back, {session?.user?.name || 'Matias Damborsky'}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {session?.user?.email || 'damborskymatias@gmail.com'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stripe Upgrade Button */}
          <UpgradeButton />

          {/* Sign Out Form */}
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

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <DashboardClient initialMessages={initialMessages} session={session} />
      </main>
    </div>
  );
}
