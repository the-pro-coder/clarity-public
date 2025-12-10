import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SendIcon } from "lucide-react";

export default function AITutorSection({ className }: { className: string }) {
  return (
    <Card className={`flex flex-1 flex-col gap-2 items-center ${className}`}>
      <h2 className="text-center max-md:text-2xl text-4xl font-semibold">
        AI Tutor
      </h2>
      <p className="text-secondary max-md:text-lg max-md:max-w-9/10 text-center text-xl">
        Ask Clarity for explanations, flashcards, examples or rapid help.
      </p>
      <div className="flex w-full max-md:w-9/10 items-center mt-5 justify-center gap-3">
        <input
          className="w-4/5 shadow-md focus:border-primary outline-none focus:outline-none active:outline-none transition-colors p-2 rounded-lg active:shadow-blue-200 focus:shadow-blue-200 dark:active:shadow-none dark:focus:shadow-none active:border-primary border-2"
          placeholder="Ask something"
        />
        <Button className="h-full max-lg:w-10">
          <SendIcon size={30} />
        </Button>
      </div>
    </Card>
  );
}
