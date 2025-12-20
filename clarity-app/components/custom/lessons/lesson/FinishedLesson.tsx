import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import confetti from "canvas-confetti";
import { useState } from "react";

export default function FinishedLesson({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const [state, setState] = useState<"idle" | "loading">("idle");
  //   ConfettiSideCannons(3, ["#6DA5FF", "#FFE28A"], ["#7CE9B3", "#A58CFF"]);
  if (state == "idle") {
    confetti({
      colors: ["#6DA5FF", "#7CE9B3", "#FFE28A", "#A58CFF"],
      origin: { x: 0.5, y: 0.4 },
    });
  }
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="my-4">
          <h2 className="text-7xl p-4">🎉</h2>
        </EmptyMedia>
        <EmptyTitle className="text-3xl">Congrats!</EmptyTitle>
        <EmptyDescription>
          You just made <span className="text-primary">amazing progress!</span>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          size="sm"
          disabled={state == "loading"}
          onClick={() => {
            setState("loading");
            onContinue();
          }}
        >
          {state == "loading" && <Spinner />}{" "}
          {state == "loading" ? "Loading" : "Continue"}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
