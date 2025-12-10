import { Card } from "@/components/ui/card";
import ImprovementAreaCard from "./ImprovementAreaCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export type ImprovementArea = {
  subject: string;
  title: string;
  suggestedImprovements: string[];
  category: "theory" | "practice" | "creativity";
};

const improvementAreas: ImprovementArea[] = [
  {
    subject: "English",
    title: "Practice Past Tenses",
    category: "theory",
    suggestedImprovements: ["irregular verbs", "subject-verb agreement"],
  },
  {
    subject: "Math",
    title: "Review Sign Rules",
    category: "practice",
    suggestedImprovements: ["sign multiplication"],
  },
  {
    subject: "Math",
    title: "Retry Sine Operations",
    category: "practice",
    suggestedImprovements: [
      "recalling sine formula",
      "distinguishing sine from cosine",
      "identifying sines correctly",
    ],
  },
  {
    subject: "English",
    title: "Review Plot Characteristics",
    category: "creativity",
    suggestedImprovements: [
      "reviewing timeline of a plot",
      "analyzing a plot's theme",
      "discovering an author's intention",
      "unveiling the plot's message",
    ],
  },
  {
    subject: "English",
    title: "Analyzing drama",
    category: "creativity",
    suggestedImprovements: ["reviewing imagery", "crafting your own drama"],
  },
];

// const improvementAreas: ImprovementArea[] = [];
export default function ImprovementAreaSection({
  maxDisplayableLessons,
}: {
  maxDisplayableLessons: number;
}) {
  return (
    <Card className="p-4">
      <h2 className="font-semibold text-3xl max-md:text-2xl text-center">
        Work in your areas of improvement
      </h2>
      <div className="flex flex-col">
        {improvementAreas.map((improvementArea, i) => {
          if (i == maxDisplayableLessons)
            return (
              <Button variant="ghost" key={i} className="flex w-fit">
                <p>View All</p>
                <ChevronRight />
              </Button>
            );
          if (i < maxDisplayableLessons) {
            return <ImprovementAreaCard key={i} data={improvementArea} />;
          }
        })}
      </div>
    </Card>
  );
}
