"use client";
import { Card } from "@/components/ui/card";
import { LessonSection } from "@/utils/supabase/tableTypes";
import { LightbulbIcon, PauseIcon, PlayIcon, RotateCcw } from "lucide-react";
import { Fragment, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import capitalize from "../../util/Capitalize";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { GenerateRoadmap, GradeCreativityAnswer } from "@/app/dashboard/action";
import FinishedLesson from "./FinishedLesson";
import SearchImage from "../../util/SearchImage";

type TheoryCardContent = {
  type: "theory";
  sentences: string[];
  keywords: string[][];
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
  instructions: string;
  tips: string[];
  minCharacters: number;
};

export type LessonSectionContent =
  | TheoryCardContent
  | PracticeCardContent
  | CreativityCardContent;

export default function LessonCard({
  section,
  content,
  action,
  isLastSection,
  completedCallbackAction,
  onCompletedCallbackAction,
}: {
  section: LessonSection;
  content?: LessonSectionContent;
  isLastSection: boolean;
  action: () => void;
  completedCallbackAction: () => void;
  onCompletedCallbackAction: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  if (content == undefined) return;
  if (isCompleted) {
    return (
      <div className="absolute w-dvw h-dvh bg-background top-0 left-0 flex">
        <FinishedLesson onContinue={onCompletedCallbackAction} />;
      </div>
    );
  }
  return (
    <Card className="w-full max-h-fit py-4 max-sm:py-2">
      <div className="w-95/100 mx-auto">
        {section.type == "theory" && content.type === "theory" && (
          <TheoryCard
            onFinishedCallback={() => {
              setIsCompleted(true);
            }}
            isLastSection={isLastSection}
            content={content}
            continueCallback={action}
            completedCallbackAction={completedCallbackAction}
          />
        )}
        {section.type == "practice" && content.type === "practice" && (
          <PracticeCard
            onFinishedCallback={() => {
              setIsCompleted(true);
            }}
            isLastSection={isLastSection}
            content={content}
            continueCallback={action}
            completedCallbackAction={completedCallbackAction}
          />
        )}
        {section.type == "creativity" && content.type === "creativity" && (
          <CreativityCard
            onFinishedCallback={() => {
              setIsCompleted(true);
            }}
            isLastSection={isLastSection}
            content={content}
            continueCallback={action}
            completedCallbackAction={completedCallbackAction}
          />
        )}
      </div>
    </Card>
  );
}

function TheoryCard({
  content,
  playbackSpeed = 6,
  isLastSection,
  continueCallback,
  completedCallbackAction,
  onFinishedCallback,
}: {
  content: TheoryCardContent;
  playbackSpeed?: number;
  isLastSection: boolean;
  continueCallback: () => void;
  completedCallbackAction: (value: "completed" | "incomplete") => void;
  onFinishedCallback: () => void;
}) {
  const [playbackState, setPlaybackState] = useState<
    "playing" | "paused" | "ended"
  >("playing");
  const [currentSentence, setCurrentSentence] = useState(0);
  const [currentKeywords, setCurrentKeywords] = useState(
    content.keywords[currentSentence]
  );
  useEffect(() => {
    if (playbackState != "playing") return;
    const i = setInterval(() => {
      setCurrentSentence((prev) => {
        const next = prev + 1;
        if (next < content.sentences.length) {
          setCurrentKeywords(content.keywords[next]);
          return next;
        }
        clearInterval(i);
        setPlaybackState("ended");
        return 0;
      });
    }, playbackSpeed * 1000);
    return () => clearInterval(i);
  }, [
    playbackSpeed,
    content.sentences.length,
    playbackState,
    setCurrentKeywords,
    content.keywords,
  ]);
  if (playbackState === "ended") completedCallbackAction("completed");
  return (
    <div className="flex flex-col">
      {currentKeywords.length > 0 && (
        <Fragment>
          {currentKeywords.length == 1 && (
            <SearchImage
              className="rounded-full shadow-md left-1/5 absolute morph-img"
              keyword={currentKeywords[0]}
            />
          )}
          {currentKeywords.length > 1 && (
            <SearchImage
              className="right-1/5 shadow-xl rounded-full absolute morph-img"
              keyword={currentKeywords[currentKeywords.length - 1]}
            />
          )}
        </Fragment>
      )}
      {playbackState === "playing" && (
        <button
          onClick={() => {
            setPlaybackState("paused");
          }}
          className="bg-blue-200 max-sm:text-xs max-sm:p-1.5 hover:brightness-90 active:brightness-80 transition-all flex w-fit p-2 text-primary rounded-full items-center gap-1"
        >
          <PauseIcon size={20} /> <span>Auto-reading</span>
        </button>
      )}
      {playbackState === "paused" && (
        <button
          onClick={() => {
            setPlaybackState("playing");
          }}
          className="flex max-sm:text-xs max-sm:p-1.5 w-fit p-2 bg-accent hover:brightness-90 active:brightness-80 transition-all rounded-full items-center gap-1"
        >
          <PlayIcon size={20} /> <span>Click to continue</span>
        </button>
      )}
      {playbackState === "ended" && (
        <button
          onClick={() => {
            setPlaybackState("playing");
          }}
          className="flex max-sm:text-xs max-sm:p-1.5 w-fit p-2 bg-emerald-200 hover:brightness-90 active:brightness-80 transition-all rounded-full items-center gap-1 text-emerald-600"
        >
          <RotateCcw size={20} /> <span>Play Again</span>
        </button>
      )}
      <span className="text-xl mt-2 flex flex-col gap-3 max-sm:gap-0 max-sm:text-base">
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
      <div className="flex items-center mt-3 max-sm:mt-1">
        <Progress
          value={
            playbackState == "ended"
              ? 100
              : (currentSentence / content.sentences.length) * 100
          }
          className="w-4/5 m-auto"
        />
      </div>
      <div className="flex mt-5 max-sm:mt-3 justify-end">
        <Button
          onClick={() => {
            if (!isLastSection) {
              continueCallback();
              setPlaybackState("playing");
            } else {
              onFinishedCallback();
            }
          }}
          disabled={playbackState !== "ended"}
        >
          {!isLastSection ? "Continue" : "Finish"}
        </Button>
      </div>
    </div>
  );
}

function PracticeCard({
  content,
  continueCallback,
  isLastSection,
  completedCallbackAction,
  onFinishedCallback,
}: {
  content: PracticeCardContent;
  isLastSection: boolean;
  continueCallback: () => void;
  completedCallbackAction: (value?: "completed" | "incomplete") => void;
  onFinishedCallback: () => void;
}) {
  const id = useId();
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const router = useRouter();
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | "idle"
  >("idle");
  function checkAnswer() {
    if (answerStatus == "correct") {
      if (isLastSection) {
        onFinishedCallback();
      } else {
        continueCallback();
      }
    }
    if (selectedAnswer == -1) return;
    if (answerStatus != "idle") {
      setAnswerStatus("idle");
      setSelectedAnswer(-1);
      return;
    }
    const correct = content.answers[selectedAnswer].correct;
    setAnswerStatus(() => (correct ? "correct" : "incorrect"));
    completedCallbackAction(correct ? "completed" : "incomplete");
  }
  return (
    <div className="flex flex-col gap-5 max-sm:gap-2">
      <h2 className="font-bold text-2xl max-sm:text-xl">{content.question}</h2>
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
              } ${
                selectedAnswer == i && answerStatus == "correct"
                  ? "bg-emerald-100 border-emerald-400 "
                  : ""
              }`}
              htmlFor={`${id}-${i}`}
            >
              <RadioGroupItem id={`${id}-${i}`} value={`${i}`} key={i} />
              <span
                className={`ml-1 ${
                  selectedAnswer == i && answerStatus == "correct"
                    ? "text-emerald-400 "
                    : ""
                }`}
              >
                {answer.text}
              </span>
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
          <h3 className="text-xl max-sm:text-base font-bold">🎉 Great job!</h3>
        )}
        {answerStatus == "incorrect" && (
          <h3 className="text-xl max-sm:text-[15px] font-bold">
            💡 Not quite, but you can learn from this!
          </h3>
        )}
        <p className="text-foreground max-sm:text-sm">
          {capitalize(content.explanation)}
        </p>
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
              ? !isLastSection
                ? "Continue"
                : "Finish"
              : "Retry"
            : "Check Answer"}
        </Button>
      </div>
    </div>
  );
}

function CreativityCard({
  content,
  continueCallback,
  isLastSection,
  completedCallbackAction,
  onFinishedCallback,
}: {
  content: CreativityCardContent;
  continueCallback: () => void;
  isLastSection: boolean;
  completedCallbackAction: (value: "completed" | "incorrect") => void;
  onFinishedCallback: () => void;
}) {
  const [currentCharacters, setCurrentCharacters] = useState(0);
  const router = useRouter();
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | "idle"
  >("idle");
  const [explanation, setExplanation] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  function checkAnswer() {
    if (answerStatus == "incorrect") {
      setAnswerStatus("idle");
      setExplanation("");
    } else if (answerStatus == "correct") {
      if (isLastSection) {
        onFinishedCallback();
      } else {
        if (textAreaRef.current != undefined) {
          textAreaRef.current.value = "";
        }
        setCurrentCharacters(0);
        setAnswerStatus("idle");
        continueCallback();
      }
    }
    // AI VALIDATION, add later please
    else {
      if (!textAreaRef.current?.value) return;
      GradeCreativityAnswer(
        content.instructions,
        textAreaRef.current.value
      ).then((data) => {
        const result = data;
        setAnswerStatus(result.status);
        setExplanation(result.feedback);
        completedCallbackAction(
          result.status == "correct" ? "completed" : "incorrect"
        );
      });
    }
  }
  return (
    <div className="flex flex-col gap-5 max-sm:gap-2">
      <section className="bg-orange-100 p-2 rounded-md border-2 border-orange-400">
        <h2 className="text-2xl font-bold max-sm:text-lg">
          {content.instructions}
        </h2>
      </section>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            className="flex justify-start w-fit max-sm:text-sm"
            variant={"ghost"}
          >
            <LightbulbIcon />
            <span className="text-secondary">Need some inspiration?</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <ul className="ml-5 flex flex-col gap-2">
            {content.tips.map((tip, i) => {
              return (
                <li className="text-secondary max-sm:text-sm" key={i}>
                  - {tip}
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
      <div className="flex flex-col gap-2">
        <div className="justify-end flex text-sm">
          <span
            className={`${
              currentCharacters >= content.minCharacters &&
              answerStatus == "idle"
                ? "text-orange-400"
                : "hidden"
            }`}
          >
            Ready to submit!
          </span>
        </div>
        <Textarea
          ref={textAreaRef}
          disabled={answerStatus != "idle"}
          onChange={(e) => {
            e.target.value = e.target.value.trimStart();
            setCurrentCharacters(e.target.value.trim().length);
          }}
          placeholder="Type your answer here"
          className="resize-none max-sm:text-sm max-sm:min-h-30 max-sm:max-h-30 text-lg min-h-40 max-h-40 bg-orange-100 border-2 border-orange-400 focus-visible:ring-0 focus-visible:border-orange-200 transition-colors md:text-base"
        />
        <div className="text-sm">
          <span
            className={`${
              currentCharacters >= content.minCharacters
                ? "text-orange-400"
                : ""
            }`}
          >
            {currentCharacters} characters
            {currentCharacters < content.minCharacters && (
              <span> (min {content.minCharacters})</span>
            )}
          </span>
        </div>
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
          <p className="text-foreground">{capitalize(explanation)}</p>
        </section>
        <div className="flex justify-end">
          <Button
            onClick={checkAnswer}
            className={`${
              answerStatus === "incorrect"
                ? "bg-orange-400 hover:bg-orange-300"
                : ""
            }`}
            disabled={currentCharacters < content.minCharacters}
          >
            {answerStatus == "idle"
              ? "Check answer"
              : answerStatus == "correct"
              ? isLastSection
                ? "Finish"
                : "Continue"
              : "Retry"}
          </Button>
        </div>
      </div>
    </div>
  );
}
