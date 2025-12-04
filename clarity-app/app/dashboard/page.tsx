import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
async function userRowExists() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return false; // no session

  const { data, error } = await supabase
    .from("Users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle(); // returns one row or null

  if (error && error.code !== "PGRST116") {
    // ignore "no rows" error if using older libs
    throw error;
  }

  // if data is not null → row exists
  return !!data;
}

async function profileRowExists() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return false; // no session

  const { data, error } = await supabase
    .from("Profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle(); // returns one row or null

  if (error && error.code !== "PGRST116") {
    // ignore "no rows" error if using older libs
    throw error;
  }

  // if data is not null → row exists
  return !!data;
}
async function GetUser() {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  const alreadyInsertedUser = await userRowExists();
  const alreadyInsertedProfile = await profileRowExists();
  if (!alreadyInsertedUser) {
    const { data, error } = await supabase
      .from("Users")
      .insert({ user_id: user?.id, email: user?.email });
    if (!error) return data;
  }
  if (!alreadyInsertedProfile) {
    redirect("/dashboard/get-started");
  }

  if (alreadyInsertedUser) {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("user_id", user?.id);
    if (!error) return data;
  }
}
export default async function Dashboard() {
  const user = await GetUser();
  return <h1>Welcome!</h1>;
}
