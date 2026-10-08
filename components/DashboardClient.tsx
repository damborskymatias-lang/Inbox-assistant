"use client";

import { useState } from "react";
import EmailDetailClient from "./EmailDetailClient";
import Link from "next/link";

export default function DashboardClient({ initialMessages, session }: { initialMessages: any[], session: any }) {
  const [filter, setFilter] = useState<"All" | "Urgent" | "Important">("All");
  const [selectedMessage, setSelectedMessage] = useState<any>(initialMessages[0] || null);

  const filteredMessages = initialMessages.filter((msg) => {
    if (filter === "All") return true;
    return msg.priority === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div>
            <h1 className="text-lg font-bold">Welcome back, {session?.user?.name || "User"}!</h1>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
          >
            Sign out
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {(["All", "Urgent", "Important"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === type
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            {filteredMessages.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
                No messages found for this filter.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedMessage?.id === msg.id
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-xs truncate max-w-[150px]">{msg.from}</span>
                    <span className="text-[10px] text-gray-400">{msg.date}</span>
                  </div>
                  <p className="text-xs font-medium truncate">{msg.subject}</p>
                </div>
              ))
            )}
          </div>

          <div className="md:col-span-2">
            <EmailDetailClient
              selectedEmail={selectedMessage}
              subject={selectedMessage?.subject}
              from={selectedMessage?.from}
              date={selectedMessage?.date}
              bodyText={selectedMessage?.bodyText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
