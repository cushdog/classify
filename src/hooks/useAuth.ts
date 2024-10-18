// hooks/useAuth.ts

import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const login = () => signIn("google");
  const logout = () => signOut();

  return {
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};