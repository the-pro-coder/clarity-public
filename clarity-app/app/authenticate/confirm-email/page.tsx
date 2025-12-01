"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
export default function ConfirmEmailPage() {
  const router = useRouter();
  async function CheckConfirmation() {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // user may be null if not logged in
    const isConfirmed = !!user?.email_confirmed_at;
    if (isConfirmed) router.push("/dashboard");
  }
  return (
    <main className="w-[85%] m-auto py-10 max-h-full h-full flex justify-around">
      <section className="flex py-10 flex-1 w-full flex-col gap-13 max-md:items-center">
        <Image
          src="/app logos/full logo light.png"
          alt="Clarity Logo"
          width={300}
          height={150}
          className="max-sm:w-60"
        />
        <h2 className="font-bold text-6xl max-sm:text-3xl max-sm:w-4/5">
          Verify Your Email
        </h2>
        <p className="text-2xl w-13/20 max-sm:text-lg max-sm:w-4/5">
          A confirmation link has been sent to your email. Ciick on the link,
          and then click on the button below to verify your email. If you
          didn&apos;t receive an email,{" "}
          {
            <Button
              variant={"link"}
              className="cursor-pointer text-primary p-0 text-2xl max-sm:text-lg"
            >
              click here.
            </Button>
          }
        </p>
        <Button
          className="w-fit text-xl py-6 rounded-sm px-20 max-sm:w-[95%] max-sm:px-4"
          size={"lg"}
          onClick={CheckConfirmation}
        >
          Confirm Your Email
        </Button>
      </section>
      <section className="w-full flex-1 flex justify-start items-center max-md:hidden">
        <Image
          src="/auth/confirm-email/confirm email page icons.png"
          width={2000}
          height={2000}
          alt="Books, bells, laptop icons"
        />
      </section>
    </main>
  );
}
