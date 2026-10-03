export const dynamic = 'force-dynamic';
"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <h1>Sign in to Inbox Assistant</h1>
      <p>Manage your emails efficiently.</p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        Sign in with Google
      </button>
    </div>
  )
}
