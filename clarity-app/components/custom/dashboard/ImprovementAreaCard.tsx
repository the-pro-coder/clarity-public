import capitalize from "../util/Capitalize";
import { ImprovementArea } from "./ImprovementAreaSection";
import {
  BookOpen,
  ChevronRight,
  SparklesIcon,
  FlaskConical,
} from "lucide-react";
export default function ImprovementAreaCard({
  data,
  gotoLesson,
}: {
  data: {
    subject: string;
    area: string;
    suggestedExercisesTopic: string;
    improvementRequirements: string;
    lesson_id: string;
  };
  gotoLesson: (data: {
    subject: string;
    area: string;
    suggestedExercisesTopic: string;
    improvementRequirements: string;
    lesson_id: string;
  }) => Promise<void>;
}) {
  const { subject, area, improvementRequirements } = data;
  return (
    <div
      onClick={() => {
        gotoLesson(data);
      }}
      className="hover:bg-accent cursor-pointer p-2 flex gap-1 rounded-md transition-colors"
    >
      <div className="flex flex-col w-full">
        <h2 className="text-primary font-bold text-2xl flex items-center">
          <span>
            {area
              .split(" ")
              .map((chunk) => capitalize(chunk))
              .join(" ")}
          </span>
        </h2>
        <h3 className="text-secondary">{capitalize(subject)}</h3>
        <div>
          <p>
            You need to <b>{improvementRequirements.toLowerCase()}</b>
          </p>
        </div>
        <hr className="mt-2" />
      </div>
      <div className="flex items-center">
        <ChevronRight />
      </div>
    </div>
  );
}
