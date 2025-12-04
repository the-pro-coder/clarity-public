import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  console.log("XD");
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/authenticate";

  console.log("[CALLBACK] URL:", url.toString());
  console.log("[CALLBACK] code:", code);
  console.log("[CALLBACK] next:", next);

  if (!code) {
    return NextResponse.redirect(`${url.origin}/authenticate?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${url.origin}/authenticate?error=exchange_failed`
    );
  }

  // Session created correctly, redirecting
  return NextResponse.redirect(`${url.origin}${next}`);
}
