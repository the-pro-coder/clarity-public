"use client";

import { Fragment } from "react/jsx-runtime";
import LessonTopSection from "./LessonTopSection";
import { useState } from "react";
import { Lesson } from "../../dashboard/LessonCardBig";
import LessonCard from "./LessonCard";

export default function LessonContent({ lesson }: { lesson: Lesson }) {
  const [currentSection, setCurrentSection] = useState(
    lesson.lessonSections[0]
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
        action={() => {
          setCurrentSection((prev) => {
            const currentSectionIndex = lesson.lessonSections.findIndex(
              (section) => section == currentSection
            );
            if (currentSectionIndex + 1 < lesson.lessonSections.length) {
              return lesson.lessonSections[currentSectionIndex + 1];
            }
            return prev;
          });
        }}
      />
    </section>
  );
}
