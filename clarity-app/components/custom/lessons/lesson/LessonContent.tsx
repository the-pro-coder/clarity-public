"use client";

import LessonTopSection from "./LessonTopSection";
import { useState } from "react";
import LessonCard from "./LessonCard";
import { useRouter } from "next/navigation";
import {
  GenerateLessonsAndUpload,
  GenerateRoadmap,
  GetRoadmap,
  GetRowFromTable,
  GetTopic,
  GetUnit,
  UpdateLessonSections,
  updateRowInTable,
  updateTopicRowInTable,
} from "@/app/dashboard/action";
import { Lesson, Profile, Roadmap, Unit } from "@/utils/supabase/tableTypes";
import GeneratingContent from "../../prefabs/Loading Screen/GeneratingContent";
import { DiamondIcon } from "lucide-react";

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
  const [isGenerating, setIsGenerating] = useState(false);
  function SetSectionAsCompleted(
    value: "completed" | "incomplete" = "completed"
  ) {
    if (currentSection == undefined) return;
    const section = lesson.lesson_sections.findIndex(
      (section) => section.section_id == currentSection.section_id
    );
    if (section != -1 && currentSection != undefined) {
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
              setIsGenerating(true);
              GenerateRoadmap(profile, lesson.subject).then(() => {
                router.replace("/dashboard");
              });
            } else {
              const profileUpdated = { ...profile };
              profileUpdated.current_lesson_ids =
                profileUpdated.current_lesson_ids?.filter((lesson_id) => {
                  return lesson_id != lesson.lesson_id;
                }) || null;
              GetTopic(profile.user_id, lesson.lesson_id).then((topic) => {
                const lessonIds = topic?.lesson_ids;
                if (!lessonIds) return;
                let nextLessonId =
                  lessonIds[
                    Math.min(
                      lessonIds.indexOf(lesson.lesson_id) + 1,
                      lessonIds.length - 1
                    )
                  ];
                if (lesson.lesson_id === lessonIds[lessonIds.length - 1]) {
                  // change to next topic
                  const idToRemove = lesson.lesson_id;
                  const subject = lesson.subject;
                  const unitNumber = lesson.unit;
                  GetUnit(profile.user_id, lesson.subject, lesson.unit).then(
                    (unit) => {
                      const topicIds = unit.topic_ids;
                      if (!topicIds) return;
                      const nextTopicId =
                        topicIds[
                          Math.min(
                            topicIds.indexOf(topic.topic_id) + 1,
                            topicIds.length - 1
                          )
                        ];
                      if (nextTopicId == topicIds[topicIds.length - 1]) {
                        // unit finished, change to next unit.
                        GetRoadmap(profile.user_id).then((roadmap) => {
                          console.log(roadmap);
                          if (roadmap != null) {
                            GetUnit(
                              profile.user_id,
                              subject,
                              unitNumber + 1
                            ).then((nextUnit: Unit) => {
                              if (nextUnit != null) {
                                const nextTopic_id = nextUnit.topic_ids[0];
                                GetRowFromTable(
                                  profile.user_id,
                                  "Topics",
                                  nextTopic_id,
                                  "topic_id"
                                ).then((topic) => {
                                  console.log(topic);
                                  GenerateLessonsAndUpload(
                                    profile,
                                    topic.subject,
                                    nextUnit.number,
                                    topic
                                  ).then((lessons) => {
                                    nextLessonId = lessons[0].lesson_id;
                                    topic.lesson_ids = lessons.map(
                                      (lesson: Lesson) => lesson.lesson_id
                                    );
                                    updateTopicRowInTable(
                                      profile.user_id,
                                      topic,
                                      topic.topic_id
                                    );
                                    profileUpdated.current_lesson_ids =
                                      profileUpdated.current_lesson_ids?.filter(
                                        (lesson_id) => lesson_id != idToRemove
                                      ) || null;
                                    profileUpdated.current_lesson_ids?.push(
                                      nextLessonId
                                    );
                                    updateRowInTable(
                                      profile.user_id,
                                      profileUpdated,
                                      "profiles"
                                    ).then(() => {
                                      router.replace("/dashboard");
                                    });
                                  });
                                });
                              }
                            });
                          }
                        });
                      } else {
                        GetRowFromTable(
                          profile.user_id,
                          "Topics",
                          nextTopicId,
                          "topic_id"
                        ).then((topic) => {
                          console.log(topic);
                          GenerateLessonsAndUpload(
                            profile,
                            topic.subject,
                            unit.number,
                            topic
                          ).then((lessons) => {
                            nextLessonId = lessons[0].lesson_id;
                            topic.lesson_ids = lessons.map(
                              (lesson: Lesson) => lesson.lesson_id
                            );
                            console.log(topic.lesson_ids);
                            console.log(topic);
                            updateTopicRowInTable(
                              profile.user_id,
                              topic,
                              topic.topic_id
                            );
                            profileUpdated.current_lesson_ids =
                              profileUpdated.current_lesson_ids?.filter(
                                (lesson_id) => lesson_id != idToRemove
                              ) || null;
                            profileUpdated.current_lesson_ids?.push(
                              nextLessonId
                            );
                            updateRowInTable(
                              profile.user_id,
                              profileUpdated,
                              "profiles"
                            ).then(() => {
                              router.replace("/dashboard");
                            });
                          });
                        });
                      }
                    }
                  );
                } else {
                  profileUpdated.current_lesson_ids?.push(nextLessonId);
                  updateRowInTable(
                    profile.user_id,
                    profileUpdated,
                    "profiles"
                  ).then(() => {
                    router.replace("/dashboard");
                  });
                }
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
        <div className="flex w-full mb-3 justify-center gap-2">
          {lesson.category != "diagnostic" &&
            lesson.lesson_sections.map((l, i) => {
              return (
                <DiamondIcon
                  key={i}
                  size={35}
                  className={`${
                    l.status == "completed"
                      ? "fill-emerald-400 border-emerald-400"
                      : l.status == "incorrect"
                      ? "fill-yellow-400"
                      : ""
                  }`}
                />
              );
            })}
        </div>
        {isGenerating && <GeneratingContent />}
      </section>
    );
  }
}
