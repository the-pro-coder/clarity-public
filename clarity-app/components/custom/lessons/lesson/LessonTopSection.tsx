import {
  BookIcon,
  CircleQuestionMarkIcon,
  IconNode,
  SparklesIcon,
} from "lucide-react";
import { LessonSection } from "@/utils/supabase/tableTypes";
import capitalize from "../../util/Capitalize";

export default function LessonTopSection({
  sectionTitle,
  sectionType,
}: {
  sectionTitle: string;
  sectionType: LessonSection["type"];
}) {
  let icon: React.ReactNode;
  let primaryColorClass: string = "";
  let bgAccentColorClass: string = "";
  if (sectionType == "theory") {
    icon = <BookIcon size={30} />;
    primaryColorClass = "text-primary";
    bgAccentColorClass = "bg-blue-200";
  } else if (sectionType == "practice") {
    icon = <CircleQuestionMarkIcon size={30} />;
    primaryColorClass = "text-emerald-400";
    bgAccentColorClass = "bg-emerald-200";
  } else if (sectionType == "creativity") {
    primaryColorClass = "text-orange-400";
    bgAccentColorClass = "bg-orange-200";
    icon = <SparklesIcon size={30} />;
  }
  return (
    <section className={`flex gap-3 ${primaryColorClass}`}>
      <div className="flex items-end">
        <div className={`rounded-lg p-2 ${bgAccentColorClass}`}>{icon}</div>
      </div>
      <div>
        <p className="font-bold">{capitalize(sectionType)}</p>
        <h2 className="text-foreground font-bold text-2xl">{sectionTitle}</h2>
      </div>
    </section>
  );
}
