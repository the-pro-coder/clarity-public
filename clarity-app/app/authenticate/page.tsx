import AuthCard from "@/components/custom/auth/AuthCard";
import { Card } from "@/components/ui/card";
import Image from "next/image";
export default function AuthenticationPage() {
  return (
    <main className="flex flex-col m-auto justify-center gap-4">
      <section className="flex flex-col items-center pt-4 gap-2">
        <Image
          src="/app logos/square/2048x2048/Clarity Square Deployment 2048x2048.png"
          alt="Clarity Logo"
          width={100}
          height={100}
          className="rounded-md"
        />
        <h2 className="font-bold text-3xl">Clarity</h2>
        <p className="text-secondary">
          Learning that adapts <span className="font-bold">to your mind</span>
        </p>
      </section>
      <section className="w-[90%] m-auto flex justify-center">
        <Card className="max-w-md w-full flex flex-col items-center">
          <AuthCard />
        </Card>
      </section>
    </main>
  );
}
