"use server";
import capitalize from "@/components/custom/util/Capitalize";
import { createClient } from "@/utils/supabase/server";
import { User, Preferences, Profile } from "@/utils/supabase/tableTypes";
import { redirect } from "next/navigation";

const supabase = await createClient();

async function alreadyInsertedRow(
  table: string,
  user_id: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .select("user_id")
    .eq("user_id", user_id)
    .maybeSingle(); // returns one row or null

  if (error && error.code !== "PGRST116") {
    // ignore "no rows" error if using older libs
    throw error;
  }

  // if data is not null → row exists
  return !!data;
}
async function InsertRow(
  user_id: string,
  table: string,
  data_to_insert: Profile | User | Preferences
) {
  const inserted = await alreadyInsertedRow(table, user_id);
  if (!inserted) {
    const { data, error } = await supabase
      .from(`${capitalize(table)}`)
      .insert(data_to_insert);
    return { data, error };
  }
}
export async function Setup() {
  const user = (await supabase.auth.getUser()).data.user;
  if (user != null) {
    const userDataToInsert: User = {
      user_id: user?.id || "",
      email: user?.email || "",
    };
    const response = await InsertRow(user?.id || "", "users", userDataToInsert);
    if (response?.error) {
      throw response.error;
    }
    const preferencesDataToInsert: Preferences = { user_id: user.id };
    const preferencesResponse = await InsertRow(
      user?.id || "",
      "preferences",
      preferencesDataToInsert
    );
    if (preferencesResponse?.error) {
      throw preferencesResponse.error.message;
    }
    const alreadyInsertedProfile = await alreadyInsertedRow(
      "profiles",
      user?.id || ""
    );
    if (!alreadyInsertedProfile) redirect("/dashboard/get-started");
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("user_id", user?.id);
    if (!error) return data[0];
  }
}

export async function GetUser() {
  const user = (await supabase.auth.getUser()).data.user;
  return user;
}

export async function GetRowFromTable(user_id: string, table: string) {
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .select("*")
    .eq("user_id", user_id);
  if (!error) return data[0];
}
