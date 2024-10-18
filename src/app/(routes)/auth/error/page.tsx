// app/auth/error/page.tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function Error() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>An error occurred during authentication: {error}</p>
    </div>
  );
}