"use client";

import LessonTopSection from "./LessonTopSection";
import { useState } from "react";
import { Lesson } from "../../dashboard/LessonCardBig";
import LessonCard from "./LessonCard";
import { useRouter } from "next/navigation";
import { UpdateLessonSections } from "@/app/dashboard/action";

export default function LessonContent({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(
    lesson.lesson_sections.find(
      (section, i) =>
        section.status == "not started" ||
        i == lesson.lesson_sections.length - 1
    )
  );
  function SetSectionAsCompleted(
    value: "completed" | "incomplete" = "completed"
  ) {
    if (currentSection == undefined) return;
    const section = lesson.lesson_sections.findIndex(
      (section) => section.section_id == currentSection.section_id
    );
    if (section != -1) {
      const newLesson: Lesson = { ...lesson };
      if (
        newLesson.lesson_sections[section].status != "completed" &&
        value == "completed"
      ) {
        newLesson.lesson_sections[section].status = "completed";
      }
      if (value == "incomplete") {
        newLesson.lesson_sections[section].status = "incorrect";
      }
      newLesson.percentage_completed = Math.floor(
        (newLesson.lesson_sections.filter(
          (section) => section.status == "completed"
        ).length /
          newLesson.lesson_sections.length) *
          100
      );
      if (newLesson.status == "not started") {
        newLesson.status = "in progress";
      }
      if (newLesson.percentage_completed == 100) {
        newLesson.status = "completed";
      }
      UpdateLessonSections(newLesson.lesson_id, newLesson);
    }
  }
  if (currentSection == undefined) router.push("/dashboard");
  else {
    return (
      <section className="w-3/7 m-auto flex flex-col gap-4">
        <LessonTopSection
          sectionTitle={currentSection.title}
          sectionType={currentSection.type}
        />
        <LessonCard
          section={currentSection}
          content={currentSection.content}
          completedCallbackAction={SetSectionAsCompleted}
          isLastSection={
            lesson.lesson_sections.indexOf(currentSection) ==
            lesson.lesson_sections.length - 1
          }
          action={() => {
            setCurrentSection((prev) => {
              const currentSectionIndex = lesson.lesson_sections.findIndex(
                (section) => section == currentSection
              );
              if (currentSectionIndex + 1 < lesson.lesson_sections.length) {
                return lesson.lesson_sections[currentSectionIndex + 1];
              }
              return prev;
            });
          }}
        />
      </section>
    );
  }
}
