"use client";
import { Button } from "@/components/ui/button";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import AuthServiceIcon from "./AuthServiceIcon";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function AuthCard() {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createSupabaseBrowserClient();

  const logInSelected = activeButton == "Log In";
  const passwordAnnotations = {
    text: logInSelected ? "Forgot Password?" : "At least 8 characters",
    type: logInSelected ? "button" : "text",
    href: "/",
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
      if (error) setErrorMsg(error.message);
      else router.push("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) setErrorMsg(error.message);
      else router.push("/authenticate/confirm-email");
    }
  }
  return (
    <div className="w-4/5 flex flex-col gap-3">
      {loading && (
        <div className="w-dvw h-dvh absolute top-0 left-0 flex justify-center items-center">
          <div className="w-full h-full border bg-white opacity-50 absolute top-0 left-0"></div>
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

function InputField({
  label,
  placeholder,
  type,
  required,
  annotations,
  binding,
}: {
  label: string;
  placeholder: string;
  type: string;
  required?: boolean | undefined;
  annotations?: {
    text: string;
    type: string;
    href: string;
  };
  binding: Dispatch<SetStateAction<string>>;
}) {
  label = label[0].toUpperCase() + label.substring(1);

  const Annotations: React.ReactNode =
    annotations?.type == "text" ? (
      <p className={`text-secondary text-sm`}>{annotations?.text}</p>
    ) : (
      <Link href={annotations?.href || ""}>
        <p className={`text-secondary text-sm`}>{annotations?.text}</p>
      </Link>
    );
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label} className="font-semibold">
        {label}
        {required ? <span className="text-destructive"> *</span> : ""}
      </Label>
      <Input
        required={required}
        type={type}
        name={label}
        id={label}
        className="bg-accent"
        onChange={(e) => {
          binding(e.target.value);
        }}
        placeholder={placeholder}
      />
      <div
        className={`flex w-full ${
          annotations?.type == "button" ? "justify-end" : ""
        }`}
      >
        {annotations != null && Annotations}
      </div>
    </div>
  );
}
