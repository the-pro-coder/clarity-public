"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ServicesHeaderTemplate from "@/components/custom/util/ServicesHeaderTemplate";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "checking" | "ready" | "loading" | "done" | "error"
  >("checking");

  // 1) Check that we actually have a recovery session
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // if no session, the link is invalid or expired
      if (!session) {
        setStatus("error");
        toast.error("This reset link is invalid or has expired.", {
          position: "top-center",
        });
        return;
      }

      setStatus("ready");
    }

    checkSession();
  }, [supabase]);

  useEffect(() => {
    if (status == "error")
      toast.error("Error while trying to reset password", {
        position: "top-center",
      });
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    if (newPassword != ConfirmPassword || newPassword.trim().length == 0) {
      setStatus("ready");
      return toast.error("Passwords don't match", { position: "top-center" });
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      if (error.code == "same_password") {
        setStatus("ready");
        return toast.error(
          "You should use a different password from the previous one",
          { position: "top-center" }
        );
      } else if (error.code == "weak_password") {
        setStatus("ready");
        return toast.error("Your password is not strong enough", {
          description:
            "It should be at least 8 characters long, contain a number, an uppercase character, and a special symbol",
          position: "top-center",
        });
      } else if (error.code == "email_not_confirmed") {
        setStatus("error");
        return toast.error("Your email is not confirmed", {
          description: "Please confirm it and request a new link",
          position: "top-center",
        });
      }
      setStatus("error");
    }

    setStatus("done");

    // optional: redirect to login after a short delay
    setTimeout(() => {
      router.replace("/authenticate");
    }, 1500);
  }

  if (status === "checking") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Verifying reset link…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-6 flex flex-col items-center">
          <ServicesHeaderTemplate />

          <Button
            onClick={() => router.replace("/authenticate/reset-password")}
          >
            Request a new reset link
          </Button>
        </Card>
      </main>
    );
  }

  // status === "ready" | "loading" | "done"
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-[90%] p-6 rounded-lg border bg-card space-y-4 flex flex-col gap-2">
        <ServicesHeaderTemplate />
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="New password"
            className="bg-accent"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm password"
            className="bg-accent"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Updating..." : "Update password"}
          </Button>
        </form>

        {status === "done" && (
          <p className="text-md font-semibold text-primary">
            Password updated successfully. Redirecting...
          </p>
        )}
      </div>
    </main>
  );
}
