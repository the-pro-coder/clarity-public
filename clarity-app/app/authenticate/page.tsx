import AuthCard from "@/components/custom/auth/AuthCard";
import { Card } from "@/components/ui/card";
import ServicesHeaderTemplate from "@/components/custom/util/ServicesHeaderTemplate";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type ExternalProviders = "Google" | "Microsoft" | "Discord";

async function CheckIfLoggedIn() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  if (session != null) {
    const user = (await supabase.auth.getUser()).data;
    console.log(user.user);
    if (user.user != null) redirect("/dashboard");
  }
}

export default async function AuthenticationPage() {
  await CheckIfLoggedIn();
  return (
    <main className="flex flex-col m-auto justify-center gap-4">
      <section className="w-[90%] m-auto items-center h-dvh flex justify-center">
        <Card className="max-w-lg w-full flex flex-col items-center pt-0">
          <ServicesHeaderTemplate />
          <AuthCard />
        </Card>
      </section>
    </main>
  );
}
