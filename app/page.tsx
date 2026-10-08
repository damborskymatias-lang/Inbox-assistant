import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header / Nav */}
      <header className="max-w-6xl mx-auto w-full p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🤖</span>
          <span className="font-bold text-lg tracking-tight">Inbox Assistant</span>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-indigo-600/20"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium mb-6">
          <span>✨ Powered by Google Gemini AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
          Supercharge your email inbox with <span className="text-indigo-400">artificial intelligence</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          Automatically summarize long threads, prioritize urgent messages, and manage your daily communication effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 text-sm"
          >
            Get Started Free
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold rounded-xl transition border border-gray-800 text-sm"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full p-6 text-center text-xs text-gray-600 border-t border-gray-900">
        Inbox Assistant © 2026. All rights reserved.
      </footer>
    </main>
  );
}
