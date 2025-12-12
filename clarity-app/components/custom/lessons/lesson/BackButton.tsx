"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BackButton({
  targetRoute,
  promptMsg,
  stayButtonText,
  quitButtonText,
}: {
  targetRoute?: string;
  promptMsg: {
    title: string;
    description: string;
  };
  stayButtonText: string;
  quitButtonText: string;
}) {
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-secondary hover:bg-destructive hover:text-primary-foreground"
        >
          <XIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{promptMsg.title}</DialogTitle>
          <DialogDescription>{promptMsg.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{stayButtonText}</Button>
          </DialogClose>
          <Button
            onClick={() => {
              if (targetRoute) {
                router.push(targetRoute);
              } else {
                router.back();
              }
            }}
          >
            {quitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
