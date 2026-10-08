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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">Welcome back, {session?.user?.name || "User"}!</h1>
              {/* Indikátor pripojenia */}
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">AI Active (Gemini)</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{session?.user?.email}</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-400 text-xs font-semibold rounded-lg transition"
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
                  ? "bg-indigo-600 text-white shadow shadow-indigo-600/20"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Zoznam správ vľavo */}
          <div className="space-y-2.5">
            {filteredMessages.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center space-y-3 min-h-[250px]">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No messages found</h3>
                  <p className="text-xs text-gray-400 mt-1">Your inbox is completely clean for this filter. Great job!</p>
                </div>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedMessage?.id === msg.id
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-xs truncate max-w-[140px] text-gray-900 dark:text-white">{msg.from}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        msg.priority === 'Urgent' ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900' :
                        msg.priority === 'Important' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900' :
                        'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                      }`}>
                        {msg.priority || 'Normal'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium truncate text-gray-800 dark:text-gray-200 mb-1">{msg.subject}</p>
                  <span className="text-[10px] text-gray-400">{msg.date}</span>
                </div>
              ))
            )}
          </div>

          {/* Detail vpravo */}
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
