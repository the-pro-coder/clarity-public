"use client";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import InputField from "../prefabs/InputField";
import AuthServiceIcon from "./AuthServiceIcon";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function AuthCard() {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [supabase] = useState(() => createSupabaseBrowserClient());

  const logInSelected = activeButton == "Log In";
  const passwordAnnotations = {
    text: logInSelected ? "Forgot Password?" : "At least 8 characters",
    type: logInSelected ? "button" : "text",
    href: "/authenticate/reset-password",
  };
  const CTA = logInSelected ? "Log In" : "Create Account";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (activeButton == "Log In") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        if (error.message.toLowerCase() == "email not confirmed") {
          return toast.error("Email not confirmed", {
            description: "Please confirm your email",
            action: {
              label: "Resend Link",
              onClick: async () => {
                const origin =
                  typeof window === "undefined" ? "" : window.location.origin;
                const { data, error } = await supabase.auth.resend({
                  email,
                  type: "signup",
                  options: {
                    emailRedirectTo: `${origin}/authenticate/callback`,
                  },
                });
                if (error) {
                  return toast.error("An error ocurred", {
                    description: "Please try again later",
                  });
                }
                return toast.success("Confirmation link resent");
              },
            },
          });
        } else {
          return toast.error(error.message);
        }
      } else router.push("/dashboard");
    } else {
      const origin =
        typeof window === "undefined" ? "" : window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/authenticate/callback`,
        },
      });
      setLoading(false);
      if (error) setErrorMsg(error.message);
      router.push(
        `/authenticate/confirm-email?email=${encodeURIComponent(email)}`
      );
    }
  }
  return (
    <div className="w-4/5 flex flex-col gap-3">
      {loading && (
        <div className="w-dvw h-dvh absolute top-0 left-0 flex justify-center items-center">
          <div className="w-dvw h-dvh border bg-white opacity-50 absolute top-0 left-0"></div>
          <div className="z-100 absolute w-full h-full flex justify-center items-center">
            <InfinitySpin height={200} width={200} color="#598bff" />
          </div>
        </div>
      )}
      <span className="text-destructive text-center font-bold">{errorMsg}</span>
      <div className="bg-accent p-1.5 rounded-md flex">
        <Button
          variant={"ghost"}
          onClick={() => {
            setActiveButton("Log In");
          }}
          className={`${
            activeButton == "Log In"
              ? "bg-card hover:bg-card dark:bg-card dark:hover:bg-card"
              : "hover:bg-transparent dark:hover:bg-transparent"
          } font-bold flex-1 text-md`}
        >
          Log In
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setActiveButton("Sign Up");
          }}
          className={`${
            activeButton == "Sign Up"
              ? "bg-card hover:bg-card dark:bg-card dark:hover:bg-card"
              : "hover:bg-transparent dark:hover:bg-transparent"
          } flex-1 text-md`}
        >
          Sign Up
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <InputField
          required
          label="email"
          type="email"
          placeholder={"email@example.com"}
          binding={setEmail}
        />
        <InputField
          required
          label="password"
          type="password"
          placeholder={"********"}
          annotations={passwordAnnotations}
          binding={setPassword}
        />
        <Button
          formAction={logInSelected ? () => {} : () => {}}
          type="submit"
          disabled={loading}
          className="text-white py-5 dark:text-accent font-bold text-md w-full self-center"
        >
          {CTA}
        </Button>
      </form>
      <p className="text-secondary font-semibold self-center">
        Or sign {logInSelected ? "in" : "up"} with:
      </p>
      <div className="flex justify-center gap-2 h-15 items-center">
        <AuthServiceIcon service="Google" />
        <AuthServiceIcon service="Microsoft" />
        <AuthServiceIcon service="Discord" />
      </div>
    </div>
  );
}
