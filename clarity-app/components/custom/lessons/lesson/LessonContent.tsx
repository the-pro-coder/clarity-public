"use client";

import { Fragment } from "react/jsx-runtime";
import LessonTopSection from "./LessonTopSection";
import { useState } from "react";
import { Lesson, LessonSection } from "../../dashboard/LessonCardBig";
import LessonCard from "./LessonCard";

export default function LessonContent({ lesson }: { lesson: Lesson }) {
  const [currentSection, setCurrentSection] = useState(
    lesson.lesson_sections[0]
  );
  return (
    <section className="w-3/7 m-auto flex flex-col gap-4">
      <LessonTopSection
        sectionTitle={currentSection.title}
        sectionType={currentSection.type}
      />
      <LessonCard
        section={currentSection}
        content={currentSection.content}
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
