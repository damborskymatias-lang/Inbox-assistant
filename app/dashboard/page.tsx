import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EmailDetailClient from "@/components/EmailDetailClient";

async function getGmailMessages(accessToken: string) {
  try {
    if (!accessToken) return [];

    const listRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!listRes.ok) return [];

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) return [];

    const messagePromises = listData.messages.map(async (msg: { id: string }) => {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
      if (!detailRes.ok) return null;
      return detailRes.json();
    });

    const messages = await Promise.all(messagePromises);
    return messages.filter(Boolean);
  } catch (error) {
    return [];
  }
}

function getMessageBody(payload: any): string {
  if (!payload) return "No content available.";
  
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        const nested = getMessageBody(part);
        if (nested !== "No content available.") return nested;
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
  }

  return "No text content found.";
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ emailId?: string; filter?: string }> }) {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;
  const messages = accessToken ? await getGmailMessages(accessToken) : [];
  
  const resolvedSearchParams = await searchParams;
  const selectedEmailId = resolvedSearchParams?.emailId;
  const currentFilter = resolvedSearchParams?.filter || "all";

  // Pre účely filtrovania (keďže priorita sa určuje cez AI zhrnutie, v zozname zatiaľ môžeme uchovať všetky,
  // alebo filtrovať podľa stavu. Tu priamo pripravíme URL pre kliknutia na filtre)

  const selectedEmail = messages.find((m: any) => m.id === selectedEmailId);

  let subject = "No Subject";
  let from = "Unknown";
  let date = "";
  let bodyText = "";

  if (selectedEmail) {
    const headers = selectedEmail.payload?.headers || [];
    subject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject";
    from = headers.find((h: any) => h.name === "From")?.value || "Unknown";
    date = headers.find((h: any) => h.name === "Date")?.value || "";
    bodyText = getMessageBody(selectedEmail.payload);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
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
      <main className="max-w-5xl mx-auto px-4 py-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Welcome & Message List */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back, {session.user?.name}!</h1>
            <p className="text-xs text-gray-600">
              Account <span className="font-semibold text-gray-800">{session.user?.email}</span> is successfully connected.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Messages</h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-1.5 mb-4 text-[11px]">
              <a
                href={`/dashboard${selectedEmailId ? `?emailId=${selectedEmailId}` : ""}`}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  currentFilter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </a>
              <a
                href={`/dashboard?filter=Urgent${selectedEmailId ? `&emailId=${selectedEmailId}` : ""}`}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  currentFilter === "Urgent" ? "bg-red-600 text-white" : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                Urgent
              </a>
              <a
                href={`/dashboard?filter=Important${selectedEmailId ? `&emailId=${selectedEmailId}` : ""}`}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  currentFilter === "Important" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                Important
              </a>
            </div>
            
            {messages.length === 0 ? (
              <p className="text-gray-500 text-xs">No messages found...</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg: any) => {
                  const headers = msg.payload?.headers || [];
                  const msgSubject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject";
                  const msgSender = headers.find((h: any) => h.name === "From")?.value || "Unknown Sender";
                  const isSelected = msg.id === selectedEmailId;

                  return (
                    <a
                      key={msg.id}
                      href={`/dashboard?emailId=${msg.id}${currentFilter !== 'all' ? `&filter=${currentFilter}` : ''}`}
                      className={`block p-3 border rounded-lg transition text-left ${
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <p className="text-[11px] font-semibold text-indigo-600 truncate mb-0.5">{msgSender}</p>
                      <p className="text-xs font-medium text-gray-900 truncate">{msgSubject}</p>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Email Detail View with AI Assistant */}
        <div className="md:col-span-2">
          <EmailDetailClient 
            selectedEmail={selectedEmail} 
            subject={subject} 
            from={from} 
            date={date} 
            bodyText={bodyText} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        Inbox Assistant &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
