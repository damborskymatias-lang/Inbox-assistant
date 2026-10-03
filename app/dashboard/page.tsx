import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession()

  // Ak používateľ nie je prihlásený, presmerujeme ho späť na login
  if (!session) {
    redirect("/login")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <h1>Dashboard - Inbox Assistant</h1>
      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        Welcome, <strong>{session.user?.name}</strong>!
      </p>
      <p style={{ color: "#666" }}>{session.user?.email}</p>
      
      <div style={{ marginTop: "30px" }}>
        <p>Your Google authentication is working successfully.</p>
      </div>
    </div>
  )
}
