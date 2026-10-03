"use client"

import { signIn } from "next-auth/react"

export function LoginButton() {
  return (
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
  )
}
