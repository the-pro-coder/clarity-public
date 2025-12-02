"use client";
import InputField from "@/components/custom/prefabs/InputField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  return (
    <main className="flex w-[90%] border border-red-300 m-auto h-dvh items-center">
      <section className="flex-1">
        <Card className="max-w-md flex m-auto flex-col items-center">
          <Image
            src="/app logos/full logo light.png"
            alt="Clarity app logo"
            width={300}
            height={150}
            className="object-contain"
          />
          <div className="w-[90%] flex flex-col gap-4">
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
          </div>
          <Button type="submit" className="w-[70%] text-md mt-4">
            Reset my password
          </Button>
        </Card>
      </section>
      <section className="flex-2 h-dvh py-20 flex justify-center border">
        <Image
          src="/auth/reset-password/reset-password-icon.png"
          alt="Reset password icon"
          className="object-contain border border-blue-300"
          width={1000}
          height={2000}
        />
      </section>
    </main>
  );
}
