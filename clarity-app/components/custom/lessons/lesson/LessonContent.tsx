"use client";

import LessonTopSection from "./LessonTopSection";
import { useState } from "react";
import LessonCard from "./LessonCard";
import { useRouter } from "next/navigation";
import {
  GenerateRoadmap,
  GetLesson,
  GetRowFromTable,
  GetTopic,
  UpdateLessonSections,
  updateRowInTable,
} from "@/app/dashboard/action";
import { Lesson, Profile, Topic } from "@/utils/supabase/tableTypes";

export default function LessonContent({
  lesson,
  profile,
}: {
  lesson: Lesson;
  profile: Profile;
}) {
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
      <section className="max-w-2xl w-4/5 max-sm:w-9/10 mx-auto flex flex-col gap-4">
        <LessonTopSection
          sectionTitle={currentSection.title}
          sectionType={currentSection.type}
        />
        <LessonCard
          onCompletedCallbackAction={() => {
            if (lesson.topic == null) {
              GenerateRoadmap(profile, lesson.subject).then(() => {
                router.replace("/dashboard");
              });
            } else {
              const profileUpdated = { ...profile };
              profileUpdated.current_lesson_ids?.filter((lesson_id) => {
                return lesson_id != lesson.lesson_id;
              });
              GetTopic(profile.user_id, lesson.lesson_id).then((topic) => {
                const lessonIds = topic?.lesson_ids;
                console.log(topic);
                if (!lessonIds) return;
                const nextLessonId =
                  lessonIds[
                    Math.min(
                      lessonIds.indexOf(lesson.lesson_id) + 1,
                      lessonIds.length - 1 // change when you add more topic generation
                    )
                  ];
                profileUpdated.current_lesson_ids?.push(nextLessonId);
                updateRowInTable(
                  profile.user_id,
                  profileUpdated,
                  "profiles"
                ).then(() => {
                  router.replace("/dashboard");
                });
              });
            }
          }}
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
