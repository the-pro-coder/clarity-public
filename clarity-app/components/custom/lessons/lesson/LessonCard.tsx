"use client";
import { Card } from "@/components/ui/card";
import { LessonSection } from "../../dashboard/LessonCardBig";
import { Fragment } from "react/jsx-runtime";
import { PauseIcon, PlayIcon, RotateCcw } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import capitalize from "../../util/Capitalize";

type TheoryCardContent = {
  type: "theory";
  sentences: string[];
};

type Answer = {
  text: string;
  correct: boolean;
};

type PracticeCardContent = {
  type: "practice";
  question: string;
  explanation: string;
  answers: Answer[];
};

type CreativityCardContent = {
  type: "creativity";
};

export type LessonSectionContent =
  | TheoryCardContent
  | PracticeCardContent
  | CreativityCardContent;

export default function LessonCard({
  section,
  content,
  action,
}: {
  section: LessonSection;
  content: LessonSectionContent;
  action: () => void;
}) {
  return (
    <Card className="w-full max-h-150 py-4">
      <div className="w-95/100 mx-auto">
        {section.type == "theory" && content.type === "theory" && (
          <TheoryCard content={content} continueCallback={action} />
        )}
        {section.type == "practice" && content.type === "practice" && (
          <PracticeCard content={content} continueCallback={action} />
        )}
      </div>
    </Card>
  );
}

function TheoryCard({
  content,
  playbackSpeed = 3,
  continueCallback,
}: {
  content: TheoryCardContent;
  playbackSpeed?: number;
  continueCallback: () => void;
}) {
  const [playbackState, setPlaybackState] = useState<
    "playing" | "paused" | "ended"
  >("playing");
  const [currentSentence, setCurrentSentence] = useState(0);
  useEffect(() => {
    if (playbackState != "playing") return;
    const i = setInterval(() => {
      setCurrentSentence((prev) => {
        const next = prev + 1;
        if (next < content.sentences.length) {
          return next;
        }
        clearInterval(i);
        setPlaybackState("ended");
        return 0;
      });
    }, playbackSpeed * 1000);
    return () => clearInterval(i);
  }, [playbackSpeed, content.sentences.length, playbackState]);
  return (
    <div className="flex flex-col">
      {playbackState === "playing" && (
        <button
          onClick={() => {
            setPlaybackState("paused");
          }}
          className="bg-blue-200 hover:brightness-90 active:brightness-80 transition-all flex w-fit p-2 text-primary rounded-full items-center gap-1"
        >
          <PauseIcon size={20} /> <span>Auto-reading</span>
        </button>
      )}
      {playbackState === "paused" && (
        <button
          onClick={() => {
            setPlaybackState("playing");
          }}
          className="flex w-fit p-2 bg-accent hover:brightness-90 active:brightness-80 transition-all rounded-full items-center gap-1"
        >
          <PlayIcon size={20} /> <span>Click to continue</span>
        </button>
      )}
      {playbackState === "ended" && (
        <button
          onClick={() => {
            setPlaybackState("playing");
          }}
          className="flex w-fit p-2 bg-emerald-200 hover:brightness-90 active:brightness-80 transition-all rounded-full items-center gap-1 text-emerald-600"
        >
          <RotateCcw size={20} /> <span>Play Again</span>
        </button>
      )}
      <span className="text-xl mt-2 flex flex-col gap-3">
        {content.sentences.map((sentence, i) => {
          return (
            <span key={i}>
              <span
                className={`${
                  currentSentence == i && playbackState != "ended"
                    ? "bg-amber-200 font-medium px-1"
                    : ""
                } transition-colors`}
              >
                {sentence.trim()}
              </span>
              <hr className="my-2" />
            </span>
          );
        })}
      </span>
      <div className="flex items-center mt-3">
        <Progress
          value={
            playbackState == "ended"
              ? 100
              : (currentSentence / content.sentences.length) * 100
          }
          className="w-4/5 m-auto"
        />
      </div>
      <div className="flex mt-5 justify-end">
        <Button
          onClick={() => {
            continueCallback();
            setPlaybackState("playing");
          }}
          disabled={playbackState !== "ended"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function PracticeCard({
  content,
  continueCallback,
}: {
  content: PracticeCardContent;
  continueCallback: () => void;
}) {
  const id = useId();
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | "idle"
  >("idle");
  function checkAnswer() {
    if (answerStatus == "correct") {
      continueCallback();
    }
    if (selectedAnswer == -1) return;
    if (answerStatus != "idle") {
      setAnswerStatus("idle");
      setSelectedAnswer(-1);
      return;
    }
    const correct = content.answers[selectedAnswer].correct;
    setAnswerStatus(() => (correct ? "correct" : "incorrect"));
  }
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-2xl">{content.question}</h2>
      <RadioGroup
        disabled={answerStatus != "idle"}
        className="flex flex-col"
        value={selectedAnswer != -1 ? `${selectedAnswer}` : null}
        onValueChange={(newValue) => {
          setSelectedAnswer(Number(newValue));
        }}
      >
        {content.answers.map((answer, i) => {
          return (
            <Label
              key={i}
              className={`flex font-normal text-lg flex-1 border transition-colors py-3 pl-2 rounded-md border-accent shadow-sm ${
                selectedAnswer == i
                  ? "text-primary bg-blue-100 border-primary"
                  : answerStatus == "idle"
                  ? "hover:bg-accent"
                  : ""
              }`}
              htmlFor={`${id}-${i}`}
            >
              <RadioGroupItem id={`${id}-${i}`} value={`${i}`} key={i} />
              <span className="ml-1">{answer.text}</span>
            </Label>
          );
        })}
      </RadioGroup>
      <section
        className={`flex flex-col p-2 rounded-md ${
          answerStatus == "idle"
            ? "hidden"
            : answerStatus == "correct"
            ? "bg-emerald-100 text-emerald-400"
            : "bg-orange-100 text-orange-400"
        }`}
      >
        {answerStatus == "correct" && (
          <h3 className="text-xl font-bold">🎉 Great job!</h3>
        )}
        {answerStatus == "incorrect" && (
          <h3 className="text-xl font-bold">
            💡 Not quite, but you can learn from this!
          </h3>
        )}
        <p className="text-foreground">{capitalize(content.explanation)}</p>
      </section>
      <div className="flex justify-end">
        <Button
          className={`${
            answerStatus == "incorrect"
              ? "bg-orange-400 hover:bg-orange-200"
              : "bg-primary"
          } transition-colors`}
          disabled={selectedAnswer < 0}
          onClick={checkAnswer}
        >
          {answerStatus != "idle"
            ? answerStatus == "correct"
              ? "Continue"
              : "Retry"
            : "Check Answer"}
        </Button>
      </div>
    </div>
  );
}

function CreativityCard() {}
