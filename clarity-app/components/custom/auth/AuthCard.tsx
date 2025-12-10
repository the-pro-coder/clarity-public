"use client";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import InputField from "../prefabs/InputField";
import AuthServiceIcon from "./AuthServiceIcon";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import emailAlreadyRegistered from "@/app/authenticate/server";
import LoadingScreenTemplate from "../util/LoadingScreenTemplate";

export default function AuthCard() {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
            position: "top-center",
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
                    position: "top-center",
                  });
                }
                return toast.success("Confirmation link resent", {
                  position: "top-center",
                });
              },
            },
          });
        } else {
          return toast.error(error.message, { position: "top-center" });
        }
      } else router.push("/dashboard");
    } else {
      const origin =
        typeof window === "undefined" ? "" : window.location.origin;
      const isEmailRegistered = await emailAlreadyRegistered(email);
      if (isEmailRegistered) {
        setLoading(false);
        return toast.error("Email is already registered", {
          description:
            "Please try using another email or log in with an existing account",
          position: "top-center",
        });
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/authenticate/callback`,
        },
      });
      console.log(error);
      setLoading(false);
      if (error) {
        let msg = { title: "An error occurred", description: error.message };
        if (error.code == "weak_password") {
          msg = {
            title: "Your password is not strong enough",
            description:
              "It should be at least 8 characters long, contain a number, an uppercase character, and a special symbol",
          };
        }
        return toast.error(msg.title, {
          description: msg.description,
          position: "top-center",
        });
      } else {
        router.push(
          `/authenticate/confirm-email?email=${encodeURIComponent(email)}`
        );
      }
    }
  }

  return (
    <div className="w-4/5 flex flex-col gap-3">
      {loading && <LoadingScreenTemplate />}
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
          type="submit"
          disabled={loading}
          className="py-5 font-bold text-md w-full self-center"
        >
          {CTA}
        </Button>
      </form>
      <p className="text-secondary font-semibold self-center">
        Or sign {logInSelected ? "in" : "up"} with:
      </p>
      <div className="flex justify-center gap-2 h-15 items-center">
        <AuthServiceIcon
          service="google"
          loginSelected={logInSelected}
          router={router}
        />
        <AuthServiceIcon
          service="azure"
          loginSelected={logInSelected}
          router={router}
        />
        <AuthServiceIcon
          service="discord"
          loginSelected={logInSelected}
          router={router}
        />
      </div>
    </div>
  );
}
