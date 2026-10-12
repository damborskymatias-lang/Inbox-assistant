"use client";

import { useState } from "react";

export default function EmailDetailClient({ selectedEmail, subject, from, date, bodyText }: any) {
  const [summary, setSummary] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedReplyIndex, setCopiedReplyIndex] = useState<number | null>(null);
  const [sendingIndex, setSendingIndex] = useState<number | null>(null);
  const [sentIndex, setSentIndex] = useState<number | null>(null);
  const [language, setLanguage] = useState("English");

  async function handleSummarize() {
    setLoading(true);
    setSummary(null);
    setPriority(null);
    setQuickReplies([]);
    setCopied(false);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent: bodyText, subject, sender: from, language }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setPriority(data.priority || "Normal");
        setQuickReplies(data.quickReplies || [
          "Thank you for the update. I will review this shortly.",
          "Accepted. Let's proceed as discussed.",
          "Could you please provide more details on this matter?"
        ]);
      } else {
        setSummary("Failed to generate summary.");
      }
    } catch (err) {
      setSummary("Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleCopyReply(replyText: string, index: number) {
    navigator.clipboard.writeText(replyText);
    setCopiedReplyIndex(index);
    setTimeout(() => setCopiedReplyIndex(null), 2000);
  }

  async function handleSendReply(replyText: string, index: number) {
    setSendingIndex(index);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: from,
          subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
          threadId: selectedEmail?.threadId || selectedEmail?.id,
          messageId: selectedEmail?.id,
          body: replyText,
        }),
      });

      if (res.ok) {
        setSentIndex(index);
        setTimeout(() => setSentIndex(null), 3000);
      } else {
        alert("Failed to send email. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email.");
    } finally {
      setSendingIndex(null);
    }
  }

  if (!selectedEmail) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-8 border border-gray-100 dark:border-gray-800 min-h-[400px] flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 text-sm">Select any message from the list on the left to view its details and use AI Assistant.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-8 border border-gray-100 dark:border-gray-800 min-h-[400px] flex flex-col justify-between transition-colors">
      <div>
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject}</h2>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">From:</span> {from}</p>
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span> {date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-2 text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Slovak">Slovak</option>
              <option value="German">German</option>
              <option value="Czech">Czech</option>
            </select>
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow transition disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
            >
              {loading ? (
                <span>Analyzing...</span>
              ) : (
                <span>✨ Summarize & AI Actions</span>
              )}
            </button>
          </div>
        </div>

        {summary && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-xs text-indigo-900 dark:text-indigo-200 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-bold flex items-center space-x-1">
                <span>🤖 AI Executive Summary</span>
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 transition text-[11px] font-medium cursor-pointer"
                  title="Copy summary to clipboard"
                >
                  {copied ? "Copied! ✓" : "Copy"}
                </button>
                {priority && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    priority === 'Urgent' ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900' :
                    priority === 'Important' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900' :
                    'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                  }`}>
                    {priority}
                  </span>
                )}
              </div>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>

            {quickReplies.length > 0 && (
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60">
                <p className="font-semibold mb-2 text-[11px] text-indigo-800 dark:text-indigo-300">⚡ AI Quick Replies:</p>
                <div className="flex flex-col gap-1.5">
                  {quickReplies.map((reply, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white/80 dark:bg-gray-900/80 rounded border border-indigo-100 dark:border-indigo-900 text-[11px] text-gray-800 dark:text-gray-200 flex justify-between items-center gap-2"
                    >
                      <span className="truncate flex-1">{reply}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyReply(reply, idx)}
                          className="px-2 py-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 transition font-medium cursor-pointer"
                        >
                          {copiedReplyIndex === idx ? "Copied! ✓" : "Copy"}
                        </button>
                        <button
                          onClick={() => handleSendReply(reply, idx)}
                          disabled={sendingIndex === idx}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition disabled:opacity-50 cursor-pointer"
                        >
                          {sendingIndex === idx ? "Sending..." : sentIndex === idx ? "Sent! ✓" : "Send Direct"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          {bodyText}
        </div>
      </div>
    </div>
  );
}
