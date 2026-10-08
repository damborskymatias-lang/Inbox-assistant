"use client";

import { useState } from "react";

export default function DashboardClient({ initialMessages }: { initialMessages: any[] }) {
  const [filter, setFilter] = useState<"All" | "Urgent" | "Important">("All");
  const [selectedMessage, setSelectedMessage] = useState<any>(initialMessages[0] || null);

  // Filtrovanie správ na základe zvoleného tlačidla
  const filteredMessages = initialMessages.filter((msg) => {
    if (filter === "All") return true;
    // Predpokladáme, že správa má atribút priority alebo AI prioritu
    return msg.priority === filter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filtračné tlačidlá */}
      <div className="flex items-center space-x-2">
        {(["All", "Urgent", "Important"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === type
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Zoznam správ a detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Zoznam vľavo */}
        <div className="space-y-2">
          {filteredMessages.length === 0 ? (
            <p className="text-xs text-gray-400 p-4">No messages found for this filter.</p>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedMessage?.id === msg.id
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-xs text-gray-900 dark:text-white truncate">{msg.from}</span>
                  <span className="text-[10px] text-gray-400">{msg.date}</span>
                </div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{msg.subject}</p>
              </div>
            ))
          )}
        </div>

        {/* Detailsprávy vpravo */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{selectedMessage.subject}</h3>
              <p className="text-xs text-gray-500 mb-4">From: {selectedMessage.from}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.bodyText}</p>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center text-gray-400 text-xs">
              Select a message to read.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
