"use client";
import { Card } from "@/components/ui/card";
import ImprovementAreaCard from "./ImprovementAreaCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson, Profile } from "@/utils/supabase/tableTypes";
import {
  GenerateCustomLesson,
  GenerateLesson,
  GenerateSections,
  InsertRowInTable,
  updateRowInTable,
} from "@/app/dashboard/action";
import { useRouter } from "next/navigation";
export type ImprovementArea = {
  subject: string;
  title: string;
  suggestedImprovements: string[];
  category: "theory" | "practice" | "creativity";
};

export default function ImprovementAreaSection({
  maxDisplayableLessons,
  profile,
}: {
  maxDisplayableLessons: number;
  profile: Profile;
}) {
  const router = useRouter();
  async function gotoLesson(opportunity_area: {
    subject: string;
    area: string;
    lesson_id: string;
    suggestedExercisesTopic: string;
    improvementRequirements: string;
  }) {
    const updatedProfile = { ...profile };
    let requiredIndex = updatedProfile.opportunity_areas.findIndex((area) => {
      return (
        area.area === opportunity_area.area &&
        area.improvementRequirements ===
          opportunity_area.improvementRequirements &&
        area.suggestedExercisesTopic ===
          opportunity_area.suggestedExercisesTopic &&
        area.lesson_id === opportunity_area.lesson_id &&
        area.lesson_id !== undefined
      );
    });
    if (requiredIndex !== -1) {
      router.push(
        `lessons/${updatedProfile.opportunity_areas[requiredIndex].lesson_id}`,
      );
    } else {
      GenerateCustomLesson(profile, opportunity_area).then((lesson: Lesson) => {
        if (lesson !== null) {
          console.log(lesson);
          InsertRowInTable(lesson, "lessons").then(() => {
            GenerateSections(profile, lesson).then(() => {
              requiredIndex = updatedProfile.opportunity_areas.findIndex(
                (area) => {
                  return (
                    area.area === opportunity_area.area &&
                    area.improvementRequirements ===
                      opportunity_area.improvementRequirements &&
                    area.suggestedExercisesTopic ===
                      opportunity_area.suggestedExercisesTopic
                  );
                },
              );
              updatedProfile.opportunity_areas[requiredIndex].lesson_id =
                lesson.lesson_id;
              updateRowInTable(
                profile.user_id,
                updatedProfile,
                "profiles",
              ).then(() => {
                router.push(`lessons/${lesson.lesson_id}`);
              });
            });
          });
        }
      });
    }
  }
  return (
    <Card className="p-4">
      <h2 className="font-semibold text-3xl max-md:text-2xl text-center">
        Work in your areas of improvement
      </h2>
      <div className="flex flex-col">
        {profile.opportunity_areas
          .filter((opportunity_area) => !opportunity_area.completed)
          .map((opportunity_area, i) => {
            if (i == maxDisplayableLessons)
              return (
                <Button variant="ghost" key={i} className="flex w-fit">
                  <p>View All</p>
                  <ChevronRight />
                </Button>
              );
            if (i < maxDisplayableLessons) {
              return (
                <ImprovementAreaCard
                  gotoLesson={gotoLesson}
                  key={i}
                  data={opportunity_area}
                />
              );
            }
          })}
      </div>
    </Card>
  );
}
