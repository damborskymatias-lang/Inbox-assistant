import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inbox Assistant - AI-Powered Email Management",
  description: "Manage your inbox smarter and faster with AI summaries, priority sorting, and quick replies.",
  openGraph: {
    title: "Inbox Assistant",
    description: "AI-Powered Email Management for Professionals",
    url: "https://inbox-assistant-eta.vercel.app",
    siteName: "Inbox Assistant",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
