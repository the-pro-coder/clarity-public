"use server";
import { createClient } from "@/utils/supabase/server";

export default async function emailAlreadyRegistered(email: string) {
  const supabaseServer = await createClient();
  const { data, error } = await supabaseServer.rpc("is_email_registered", {
    p_email: email,
  });
  if (error) {
    console.log("RPC Error:", error);
    throw error;
  }
  return data === true;
}
