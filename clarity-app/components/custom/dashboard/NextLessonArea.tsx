"use client";
import { Button } from "@/components/ui/button";
import capitalize from "../util/Capitalize";
import { useState } from "react";
import LessonCardBig, { Lesson, LessonSection } from "./LessonCardBig";
const dummyLesson1: Lesson = {
  subject: "Math",
  unit: 2,
  topic: "Trigonometric Identities",
  title: "Cosine: Sine's brother",
  status: "in progress",
  grade: "10th",
  category: "theory & practice",
  tags: ["triangles", "pithagoras", "angles", "identities"],
  percentageCompleted: 0,
  expectedLearning:
    "explore cosine's identity, which shows the inverse relationship in the triangle from sine.",
  lessonSections: [
    {
      type: "theory",
      title: "What is a cosine?",
      exp: 50,
      status: "completed",
    },
    {
      type: "theory",
      title: "How to get a cosine?",
      exp: 50,
      status: "completed",
    },
    {
      type: "practice",
      title: "Getting a cosine from a triangle",
      exp: 100,
      status: "not started",
    },
    {
      type: "theory",
      title: "How does the cosine relate to the sine?",
      exp: 50,
      status: "not started",
    },
    {
      type: "practice",
      title: "Inverse trigonometrics",
      exp: 100,
      status: "not started",
    },
  ],
};

dummyLesson1.percentageCompleted = Math.round(
  (dummyLesson1.lessonSections.filter((lesson) => {
    return lesson.status == "completed";
  }).length /
    dummyLesson1.lessonSections.length) *
    100
);

const dummyLesson2: Lesson = {
  subject: "English",
  unit: 3,
  topic: "Analyzing Context",
  title: "Setting: Context's Heart",
  status: "in progress",
  grade: "12th",
  category: "analysis",
  tags: ["place", "time", "story"],
  percentageCompleted: 0,
  expectedLearning:
    "understand how setting influences context, and how it shapes what we understand from a text.",
  lessonSections: [
    {
      type: "theory",
      title: "What is setting?",
      exp: 50,
      status: "completed",
    },
    {
      type: "theory",
      title: "How is setting built?",
      exp: 50,
      status: "completed",
    },
    {
      type: "practice",
      title: "Analyzing setting from an example",
      exp: 100,
      status: "completed",
    },
    {
      type: "theory",
      title:
        "Setting's matices: where does it shape context and where does it end",
      exp: 50,
      status: "completed",
    },
    {
      type: "theory",
      title: "The elements of setting",
      exp: 100,
      status: "completed",
    },
    {
      type: "practice",
      title: "Create your own setting",
      exp: 100,
      status: "not started",
    },
  ],
};

dummyLesson2.percentageCompleted = Math.round(
  (dummyLesson2.lessonSections.filter((lesson) => {
    return lesson.status == "completed";
  }).length /
    dummyLesson2.lessonSections.length) *
    100
);

export default function NextLessonArea({
  interestSubjects,
}: {
  interestSubjects: string[];
}) {
  const [activeSubject, setActiveSubject] = useState(interestSubjects[0]);
  const dummyLesson = activeSubject == "math" ? dummyLesson1 : dummyLesson2;
  return (
    <div className="flex flex-2 gap-3 flex-col">
      <div className="flex gap-3">
        {interestSubjects.map((subject, i) => {
          return (
            <Button
              variant={subject == activeSubject ? "default" : "outline"}
              key={i}
              size={"lg"}
              className={`rounded-full py-6 text-2xl ${
                subject == activeSubject ? "border border-transparent" : ""
              }`}
              onClick={() => {
                setActiveSubject(subject);
              }}
            >
              {capitalize(subject)}
            </Button>
          );
        })}
      </div>
      <div className="w-full">
        <LessonCardBig data={dummyLesson} />
      </div>
    </div>
  );
}
