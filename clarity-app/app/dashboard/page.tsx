import DashboardHeader from "@/components/custom/dashboard/DashboardHeader";
import { Setup, GetRowFromTable } from "./action";
import { Profile, Preferences, User } from "@/utils/supabase/tableTypes";

export default async function Dashboard() {
  // const [profile, progress, recommendations, settings] = await Promise.all([GetProfile(), GetUser(), GetProgress(), GetRecommendations(), GetSettings()])
  const user = await Setup();
  let profile: Profile, preferences: Preferences;
  if (user != null) {
    profile = await GetRowFromTable(`${user.user_id}`, "profiles");
    preferences = await GetRowFromTable(`${user.user_id}`, "preferences");
    return (
      <main>
        <section>
          <DashboardHeader name={profile.name} last_name={profile.last_name} />
        </section>
        <h1>Welcome {profile?.name || ""}</h1>
        <h2>Preferences: {preferences.updated_at}</h2>
      </main>
    );
  } else {
    // return loading skeleton;
    return <h1>Loading</h1>;
  }
}
