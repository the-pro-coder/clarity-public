"use server";

import { createClient } from "@/utils/supabase/server";

export type ExternalProviders = "google" | "azure" | "discord";

export default async function signInWithExternalProvider(
  provider: ExternalProviders
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${process.env.PUBLIC_BASE_URL}/api/auth/v1/callback`,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data?.url) {
    console.error("[SIGNIN] OAuth error:", error?.message);
    return { error: "Error in Signup Provider", url: null };
  }

  return { error: null, url: data.url };
}
