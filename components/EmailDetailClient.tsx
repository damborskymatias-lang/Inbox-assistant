"use client";

import { useState } from "react";

export default function EmailDetailClient({ selectedEmail, subject, from, date, bodyText }: any) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent: bodyText, subject, sender: from }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary("Failed to generate summary.");
      }
    } catch (err) {
      setSummary("Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  }

  if (!selectedEmail) {
    return (
      <div className="bg-white shadow rounded-lg p-8 border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 text-sm">Select any message from the list on the left to view its details and use AI Assistant.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-8 border border-gray-100 min-h-[400px] flex flex-col justify-between">
      <div>
        <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{subject}</h2>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-semibold text-gray-700">From:</span> {from}</p>
              <p><span className="font-semibold text-gray-700">Date:</span> {date}</p>
            </div>
          </div>
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <span>✨ Summarize with AI</span>
            )}
          </button>
        </div>

        {/* AI Summary Box */}
        {summary && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900">
            <p className="font-bold mb-1 flex items-center space-x-1">
              <span>🤖 AI Executive Summary</span>
            </p>
            <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
          {bodyText}
        </div>
      </div>
    </div>
  );
}
