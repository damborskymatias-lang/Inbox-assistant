export const dynamic = 'force-dynamic';

import { LoginButton } from "./login-button";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <h1>Sign in to Inbox Assistant</h1>
      <p>Manage your emails efficiently.</p>
      <LoginButton />
    </div>
  );
}
