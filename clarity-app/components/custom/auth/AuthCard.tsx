"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import AuthServiceIcon from "./AuthServiceIcon";
export default function AuthCard() {
  const [activeButton, setActiveButton] = useState("Log In");
  const logInSelected = activeButton == "Log In";
  const passwordAnnotations = {
    text: logInSelected ? "Forgot Password?" : "At least 8 characters",
    type: logInSelected ? "button" : "text",
    href: "/",
  };
  const CTA = logInSelected ? "Log In" : "Create Account";
  return (
    <div className="w-4/5 flex flex-col gap-3">
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
      <form className="flex flex-col gap-2">
        <InputField
          required
          label="email"
          type="email"
          placeholder={"email@example.com"}
        />
        <InputField
          required
          label="password"
          type="password"
          placeholder={"********"}
          annotations={passwordAnnotations}
        />
        <Button
          formAction={logInSelected ? () => {} : () => {}}
          type="submit"
          className="text-white dark:text-accent font-bold text-md w-full self-center"
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
