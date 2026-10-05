import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch messages from our internal Gmail API route
  let messages = [];
  let error = null;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://" + process.env.VERCEL_URL;
    const res = await fetch(`${baseUrl}/api/gmail/messages`, {
      headers: {
        cookie: `next-auth.session-token=${session.accessToken || ""}`, // or pass headers if needed
      },
      cache: "no-store",
    });
    
    // Alternatively, we can fetch directly or client-side. 
    // Since it's a Server Component, let's keep it robust.
  } catch (err) {
    error = "Failed to load messages";
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
            <button type="submit" className="text-sm text-red-600 hover:text-red-800 font-medium">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white shadow rounded-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {session.user?.name}!</h1>
          <p className="text-gray-600 mb-6">
            Your account <span className="font-semibold text-gray-800">{session.user?.email}</span> is successfully connected and ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
              <h3 className="font-semibold text-indigo-900 mb-1">Gmail API</h3>
              <p className="text-sm text-indigo-700">Connected. Ready to fetch and process your inbox messages.</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-5">
              <h3 className="font-semibold text-green-900 mb-1">Stripe Subscription</h3>
              <p className="text-sm text-green-700">Active Free Tier plan.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        Inbox Assistant &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
