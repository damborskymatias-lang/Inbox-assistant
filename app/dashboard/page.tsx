import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getGmailMessages(accessToken: string) {
  try {
    if (!accessToken) {
      return { messages: [], debugError: "Access token is missing from session." };
    }

    // 1. Fetch list of messages
    const listRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const responseText = await listRes.text();
    
    if (!listRes.ok) {
      return { 
        messages: [], 
        debugError: `Gmail API error (${listRes.status}): ${responseText}` 
      };
    }

    const listData = JSON.parse(responseText);

    if (!listData.messages || listData.messages.length === 0) {
      return { messages: [], debugError: "Gmail returned 0 messages for this account." };
    }

    // 2. Fetch details for each message concurrently
    const messagePromises = listData.messages.map(async (msg: { id: string }) => {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
      if (!detailRes.ok) return null;
      return detailRes.json();
    });

    const messages = await Promise.all(messagePromises);
    return { messages: messages.filter(Boolean), debugError: null };
  } catch (error: any) {
    return { messages: [], debugError: `Catch error: ${error.message}` };
  }
}

export default async function DashboardPage() {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;
  const { messages, debugError } = accessToken ? await getGmailMessages(accessToken) : { messages: [], debugError: "No access token found in session." };

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
        <div className="bg-white shadow rounded-lg p-8 border border-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {session.user?.name}!</h1>
          <p className="text-gray-600">
            Your account <span className="font-semibold text-gray-800">{session.user?.email}</span> is successfully connected and ready.
          </p>
        </div>

        {/* Messages Section */}
        <div className="bg-white shadow rounded-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Inbox Messages</h2>
          
          {debugError && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 font-mono overflow-x-auto">
              <strong>Debug Info:</strong> {debugError}
            </div>
          )}

          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages found or waiting for sync...</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg: any) => {
                const headers = msg.payload?.headers || [];
                const subjectHeader = headers.find((h: any) => h.name === "Subject");
                const fromHeader = headers.find((h: any) => h.name === "From");
                
                const subject = subjectHeader ? subjectHeader.value : "No Subject";
                const sender = fromHeader ? fromHeader.value : "Unknown Sender";

                return (
                  <div key={msg.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <p className="text-xs font-semibold text-indigo-600 mb-1">{sender}</p>
                    <p className="text-sm font-medium text-gray-900">{subject}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        Inbox Assistant &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
