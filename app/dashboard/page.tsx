import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-indigo-600">Inbox Assistant</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 font-medium">{session.user?.name}</span>
          <form action="/api/auth/signout" method="POST">
            {/* Prípadne použijeme NextAuth signOut */}
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white shadow rounded-lg p-8 mb-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vitaj späť, {session.user?.name}!</h1>
          <p className="text-gray-600 mb-6">
            Tvoj účet <span className="font-semibold text-gray-800">{session.user?.email}</span> je úspešne prepojený a pripravený.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
              <h3 className="font-semibold text-indigo-900 mb-1">Gmail API</h3>
              <p className="text-sm text-indigo-700">Zatiaľ nepripojené. Tu čoskoro uvidíš prehľad svojich správ.</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-5">
              <h3 className="font-semibold text-green-900 mb-1">Stripe Predplatné</h3>
              <p className="text-sm text-green-700">Aktívny bezplatný plán (Free tier).</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        Inbox Assistant &copy; 2026. Všetky práva vyhradené.
      </footer>
    </div>
  );
}
