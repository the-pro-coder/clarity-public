"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stable supabase client instance (good practice)
  const [supabase] = useState(() => createSupabaseBrowserClient());

  // Extract URL parameters with correct typing
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    // CASE 1: Supabase returned an error (expired link, invalid token, etc.)
    if (error) {
      const msg = errorDescription || "Authentication error.";

      const encoded = encodeURIComponent(msg);

      router.replace(`/authenticate/error?message=${encoded}`);
      return;
    }

    // CASE 2: Valid confirmation → verify session exists → go to dashboard
    supabase.auth.getSession().then(({ data }) => {
      console.log("Callback session:", data.session);
      router.replace("/dashboard");
    });
  }, [error, errorDescription, supabase, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 rounded-lg border bg-card">
        <h1 className="text-2xl font-bold mb-2">
          Finishing email validation...
        </h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we validate your email.
        </p>
      </div>
    </main>
  );
}
