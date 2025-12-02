"use client";
import InputField from "@/components/custom/prefabs/InputField";
import ServicesHeaderTemplate from "@/components/custom/util/ServicesHeaderTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
function ValidateEmail(p1: string, p2: string) {
  return p1 === p2 && p1.length > 0;
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");

  async function sendResetPasswordEmail(e: FormEvent) {
    e.preventDefault();
    if (ValidateEmail(email, confirmationEmail)) {
      const supabase = createSupabaseBrowserClient();
      const origin =
        typeof window === "undefined" ? "" : window.location.origin;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/authenticate/reset-password/callback`,
      });
      if (error) {
        return toast.error(error.message, { position: "top-center" });
      } else {
        return toast.success("Link sent to email", {
          description:
            "If your email is registered, a link will be sent to your inbox.",
          position: "top-center",
        });
      }
    } else {
      return toast.error("Emails don't match", { position: "top-center" });
    }
  }
  return (
    <main className="flex w-[90%] m-auto gap-6 h-dvh items-center">
      <section className="flex-1 h-full flex flex-col">
        <Card className="max-w-md flex m-auto flex-col w-full items-center">
          <form
            onSubmit={sendResetPasswordEmail}
            className="w-[90%] flex items-center flex-col gap-4"
          >
            <ServicesHeaderTemplate />
            <InputField
              required
              label="email"
              type="email"
              placeholder={"email@example.com"}
              binding={setEmail}
            />
            <InputField
              required
              label="confirm_email"
              type="email"
              placeholder={"email@example.com"}
              binding={setConfirmationEmail}
            />
            <Button type="submit" className="w-full py-5 text-md mt-5">
              Reset my password
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
