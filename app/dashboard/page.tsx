import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getGmailMessages(accessToken: string) {
  try {
    if (!accessToken) return [];

    // 1. Fetch list of messages
    const listRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!listRes.ok) return [];

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) return [];

    // 2. Fetch details (including body snippet/text) for each message concurrently
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

// Helper to extract plain text body from gmail payload parts
function getMessageBody(payload: any): string {
  if (!payload) return "No content available.";
  
  // If body has direct data
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  // If payload has parts (multipart email)
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      // Recursive check for nested parts
      if (part.parts) {
        const nested = getMessageBody(part);
        if (nested !== "No content available.") return nested;
      }
    }
    // Fallback to html part if plain text not found
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
  }

  return "No text content found.";
}

export default async function DashboardPage({ searchParams }: { searchParams: { emailId?: string } }) {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;
  const messages = accessToken ? await getGmailMessages(accessToken) : [];
  
  const resolvedSearchParams = await searchParams;
  const selectedEmailId = resolvedSearchParams?.emailId;
  const selectedEmail = messages.find((m: any) => m.id === selectedEmailId);

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
            <h1 className="text-xl font-bold text-gray-900 mb-1">Ahoj, {session.user?.name}!</h1>
            <p className="text-xs text-gray-600">
              Účet <span className="font-semibold text-gray-800">{session.user?.email}</span> je úspešne pripojený.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nedávne správy</h2>
            
            {messages.length === 0 ? (
              <p className="text-gray-500 text-xs">Žiadne správy sa nenašli...</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg: any) => {
                  const headers = msg.payload?.headers || [];
                  const subjectHeader = headers.find((h: any) => h.name === "Subject");
                  const fromHeader = headers.find((h: any) => h.name === "From");
                  
                  const subject = subjectHeader ? subjectHeader.value : "Bez predmetu";
                  const sender = fromHeader ? fromHeader.value : "Neznámy odosielateľ";
                  const isSelected = msg.id === selectedEmailId;

                  return (
                    <a
                      key={msg.id}
                      href={`/dashboard?emailId=${msg.id}`}
                      className={`block p-3 border rounded-lg transition text-left ${
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <p className="text-[11px] font-semibold text-indigo-600 truncate mb-0.5">{sender}</p>
                      <p className="text-xs font-medium text-gray-900 truncate">{subject}</p>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Email Detail View */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg p-8 border border-gray-100 min-h-[400px]">
            {selectedEmail ? (
              <div>
                {(() => {
                  const headers = selectedEmail.payload?.headers || [];
                  const subject = headers.find((h: any) => h.name === "Subject")?.value || "Bez predmetu";
                  const from = headers.find((h: any) => h.name === "From")?.value || "Neznámy";
                  const date = headers.find((h: any) => h.name === "Date")?.value || "";
                  const bodyText = getMessageBody(selectedEmail.payload);

                  return (
                    <div>
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{subject}</h2>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p><span className="font-semibold text-gray-700">Od:</span> {from}</p>
                          <p><span className="font-semibold text-gray-700">Dátum:</span> {date}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {bodyText}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-24">
                <p className="text-gray-400 text-sm">Klikni na ľubovoľnú správu v zozname vľavo pre zobrazenie jej detailu.</p>
              </div>
            )}
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
