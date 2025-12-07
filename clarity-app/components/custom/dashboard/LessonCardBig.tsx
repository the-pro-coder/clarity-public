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
import { Check, GraduationCap, Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";

export type LessonSection = {
  type: "practice" | "theory" | "creativity";
  title: string;
  exp: number;
  status: "completed" | "not started";
};
export type Lesson = {
  subject: string;
  unit: number;
  topic: string;
  title: string;
  grade: string;
  category: "theory & practice" | "analysis" | "hands-on practice";
  tags: string[];
  status: "not started" | "completed" | "in progress";
  percentageCompleted: number;
  expectedLearning: string;
  lessonSections: LessonSection[];
};
export default function LessonCardBig({ data }: { data: Lesson }) {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const {
    subject,
    unit,
    topic,
    title,
    status,
    percentageCompleted,
    expectedLearning,
    lessonSections,
  } = data;
  return (
    <Card className="flex flex-col px-4 py-4 gap-4">
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          className="text-lg text-secondary rounded-full"
        >
          {subject}
        </Button>
        <Tag>Unit {unit}</Tag>
        <Tag>{topic}</Tag>
      </div>
      <h2 className="text-3xl font-medium">{title}</h2>
      <div className="flex items-center gap-2">
        <Progress value={percentageCompleted} className="h-4 w-2/3" />
        <span>{percentageCompleted}%</span>
      </div>
      <p className="text-lg">You will {expectedLearning}</p>
      <hr />
      <div className="flex justify-around">
        <Collapsible
          onOpenChange={() => {
            setCollapsibleOpen((prev) => !prev);
          }}
          className="flex-1"
        >
          <div className="flex w-full justify-between">
            <CollapsibleTrigger>
              <Button variant={"outline"}>
                {collapsibleOpen ? "Hide" : "See"} lesson details
              </Button>
            </CollapsibleTrigger>
            <Button className="w-fit self-end text-lg" size={"lg"}>
              {status == "not started" ? "Start" : "Continue"}
            </Button>
          </div>
          <CollapsibleContent className="mt-2">
            {lessonSections.map((lessonSection, i) => {
              return (
                <div
                  key={i}
                  className="flex p-2 cursor-pointer rounded-lg justify-between hover:bg-accent transition-colors"
                >
                  <p className="flex gap-2">
                    {lessonSection.type == "theory" && <GraduationCap />}
                    {lessonSection.type == "practice" && <Lightbulb />}
                    {lessonSection.title}
                    <Sparkles className="text-primary" />
                  </p>
                  <p className="flex gap-2">
                    {lessonSection.status == "completed" && (
                      <Check className="text-primary" />
                    )}
                    {lessonSection.exp} EXP
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
