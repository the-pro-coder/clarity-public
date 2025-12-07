import DashboardHeader from "@/components/custom/dashboard/DashboardHeader";
import { Setup, GetRowFromTable } from "./action";
import { Profile, Preferences, User } from "@/utils/supabase/tableTypes";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import capitalize from "@/components/custom/util/Capitalize";
import NextLessonArea from "@/components/custom/dashboard/NextLessonArea";
import ImprovementAreaSection from "@/components/custom/dashboard/ImprovementAreaSection";

// to change later
const streak = 3;

const isLessonActive = true;

export default async function Dashboard() {
  // const [profile, progress, recommendations, settings] = await Promise.all([GetProfile(), GetUser(), GetProgress(), GetRecommendations(), GetSettings()])
  const user = await Setup();
  let profile: Profile, preferences: Preferences;
  if (user != null) {
    profile = await GetRowFromTable(`${user.user_id}`, "profiles");
    preferences = await GetRowFromTable(`${user.user_id}`, "preferences");
    const interestSubjects = profile.interest_areas;
    return (
      <main className="flex flex-col gap-10">
        <section>
          <DashboardHeader name={profile.name} last_name={profile.last_name} />
        </section>
        <section className="flex gap-15 max-w-4/5 w-4/5 m-auto">
          <div className="flex-3 flex flex-col gap-6 justify-between">
            <section className=" flex flex-col gap-6 flex-1 justify-evenly">
              <h2 className="text-6xl flex items-center gap-5">
                Hi, {profile?.name ? profile.name + "!" : ""}
                {streak >= 3 && (
                  <span className="flex hover:bg-accent cursor-default hover:outline-accent transition-colors items-center outline-4 rounded-full px-4 py-1 justify-center">
                    <Flame
                      size={50}
                      fill="orange"
                      className="text-destructive"
                    />
                    <span className="text-5xl font-bold">{streak}</span>
                  </span>
                )}
              </h2>
              <p className="text-2xl">Ready to continue your learning flow?</p>
              <h2 className="text-6xl font-bold mt-2 -mb-2">
                {isLessonActive ? "Continue Learning" : "Your Next Step"}
              </h2>
            </section>
            <section className="flex flex-col">
              <NextLessonArea interestSubjects={interestSubjects} />
            </section>
          </div>
          <section className="flex-2">
            <ImprovementAreaSection />
          </section>
        </section>
      </main>
    );
  } else {
    // return loading skeleton;
    return <h1>Loading</h1>;
  }
}
