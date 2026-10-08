import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Tu môžeme načítať reálne dáta alebo poslať predvolené
  const initialMessages = [
    {
      id: "1",
      from: "Vercel <notifications@vercel.com>",
      subject: "Production deployment failed for inbox-assistant",
      date: "Thu, 8 Oct 2026",
      bodyText: "Production deployment failed. Please check your build logs.",
      priority: "Urgent"
    },
    {
      id: "2",
      from: "ZUPPA® <info@zuppa.sk>",
      subject: "🕸️🖤 Šaty na HALLOWEEN 🖤 🕷️",
      date: "Thu, 8 Oct 2026",
      bodyText: "Pozchodová tylová sukňa má taký objem...",
      priority: "Normal"
    }
  ];

  return <DashboardClient initialMessages={initialMessages} session={session} />;
}
