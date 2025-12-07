import { ImprovementArea } from "./ImprovementAreaSection";
import {
  BookOpen,
  ChevronRight,
  SparklesIcon,
  FlaskConical,
} from "lucide-react";
export default function ImprovementAreaCard({
  data,
}: {
  data: ImprovementArea;
}) {
  const { subject, title, suggestedImprovements, category } = data;
  return (
    <div className="hover:bg-accent cursor-pointer p-2 flex gap-1 rounded-md transition-colors">
      <div className="flex flex-col w-full">
        <h3 className="text-secondary">{subject}</h3>
        <div>
          <h2 className="text-primary font-bold text-2xl flex gap-2 items-center">
            <span>{title}</span>
            {category == "creativity" && <SparklesIcon />}
            {category == "theory" && <BookOpen />}
            {category == "practice" && <FlaskConical />}
          </h2>
          <p>
            You need to improve{" "}
            {suggestedImprovements.map((improvement, i) => {
              return (
                <span className="font-semibold" key={i}>
                  {improvement}
                  {i != suggestedImprovements.length - 1 ? "," : "."}
                  {i == suggestedImprovements.length - 2 ? " and " : " "}
                </span>
              );
            })}
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
