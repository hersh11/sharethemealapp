import { Outlet } from "react-router";
import { useAuth } from "../context/contexts";
import SignIn from "../pages/SignIn";
import FullPageMessage from "./FullPageMessage";

// Signed-out visitors see the sign-in screen at whatever URL they opened, and
// land on that page once they sign in.
export default function AuthGate() {
  const { status, user } = useAuth();

  if (status === "loading") {
    return <FullPageMessage role="status">Loading…</FullPageMessage>;
  }

  return user ? <Outlet /> : <SignIn />;
}
