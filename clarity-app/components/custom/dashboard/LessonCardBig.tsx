"use client";
import { Card } from "@/components/ui/card";
import Tag from "../util/Tag";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Check,
  GraduationCap,
  Lightbulb,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LessonSectionContent } from "../lessons/lesson/LessonCard";
import { GenerateLesson } from "@/app/dashboard/action";
import capitalize from "../util/Capitalize";

export type LessonSection = {
  type: "practice" | "theory" | "creativity";
  title: string;
  exp: number;
  content?: LessonSectionContent;
  section_id: string;
  lesson_id: string;
  status?: "completed" | "not started" | "incorrect";
};
export type Lesson = {
  subject: string;
  approximate_duration: number;
  unit: number;
  topic: string;
  title: string;
  grade: string;
  category:
    | "theory & practice"
    | "analysis"
    | "hands-on practice"
    | "diagnostic";
  tags: string[];
  status: "not started" | "completed" | "in progress";
  percentage_completed: number;
  expected_learning: string;
  lesson_id: string;
  user_id: string;
  lesson_sections: LessonSection[];
};
export default function LessonCardBig({ data }: { data?: Lesson }) {
  const router = useRouter();
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  if (data == undefined || data.percentage_completed == 100) {
    return;
  }
  const {
    subject,
    unit,
    topic,
    title,
    status,
    percentage_completed,
    expected_learning,
    lesson_sections,
  } = data;
  return (
    <Card className="flex flex-col px-4 py-4 gap-4">
      <div className="flex gap-2 max-md:gap-1.5 flex-wrap">
        <Button
          variant={"ghost"}
          className="text-lg self-center text-secondary max-md:text-sm rounded-full"
        >
          {capitalize(subject)}
        </Button>
        {unit != null && (
          <Tag className="max-md:text-sm max-sm:text-[clamp(2px, 10px)] max-md:w-fit max-md:text-nowrap max-md:px-2">
            Unit {unit}
          </Tag>
        )}
        {topic != null && <Tag className="max-md:text-sm py-2">{topic}</Tag>}
      </div>
      <h2 className="text-3xl font-medium max-md:text-2xl">{title}</h2>
      <div className="flex items-center gap-2">
        <Progress value={percentage_completed} className="h-4 w-2/3" />
        <span>{percentage_completed}%</span>
      </div>
      <p className="text-lg max-md:text-base">You will {expected_learning}</p>
      <hr />
      <div className="flex justify-around">
        <Collapsible
          onOpenChange={() => {
            setCollapsibleOpen((prev) => !prev);
          }}
          className="flex-1"
        >
          <div className="flex w-full justify-between flex-wrap-reverse">
            <CollapsibleTrigger asChild className="flex items-center flex-1">
              <div className="flex items-center flex-1">
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="max-md:px-1.5 max-md:text-xs"
                >
                  {collapsibleOpen ? "Hide" : "See"} lesson details
                </Button>
              </div>
            </CollapsibleTrigger>
            <Button
              className="w-fit self-end text-lg max-md:px-4 max-md:text-sm my-2"
              size={"lg"}
              onClick={() => {
                router.push(`lessons/${data.lesson_id}`);
              }}
            >
              {status == "not started" ? "Start" : "Continue"}
            </Button>
          </div>
          <CollapsibleContent className="mt-2">
            {lesson_sections?.map((lessonSection, i) => {
              return (
                <div
                  key={i}
                  className="flex p-2 cursor-pointer rounded-lg justify-between hover:bg-accent transition-colors my-1"
                >
                  <p className="mr-3">
                    {lessonSection.type == "theory" && (
                      <GraduationCap className="inline mr-2" />
                    )}
                    {lessonSection.type == "practice" && (
                      <Lightbulb className="inline mr-2" />
                    )}
                    {lessonSection.type == "creativity" && (
                      <WandSparkles className="inline mr-2" />
                    )}
                    {lessonSection.title}
                    <Sparkles className="text-primary inline ml-2" />
                  </p>
                  <p>
                    <span className="text-nowrap text-[clamp(0.5rem, 4rem)]">
                      {lessonSection.status == "completed" && (
                        <Check className="text-primary inline mr-2" />
                      )}
                      {lessonSection.exp} EXP
                    </span>
                  </p>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}
