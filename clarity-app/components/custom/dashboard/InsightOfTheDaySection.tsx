import { Card } from "@/components/ui/card";
import InsightComponent from "./InsightComponent";
import { BoltIcon, TargetIcon, SparklesIcon } from "lucide-react";
import { ReactNode } from "react";

export type Insight = {
  archetype: string;
  icon: ReactNode;
  description: string;
  cta?: { content: string; action: string };
};

const insights: Insight[] = [
  {
    archetype: "Laser Focus Sprinter",
    icon: <BoltIcon size={75} />,
    description:
      "You work best in short, intense bursts. Keep sessions under 30 minutes and always know your next tiny step.",
    cta: {
      content: "Plan my next 25-minute sprint",
      action: "/",
    },
  },
  {
    archetype: "Deep Dive Scholar",
    icon: <TargetIcon size={75} />,
    description:
      "You love getting absorbed in one topic at a time. Fewer tasks, more depth — protect long, uninterrupted blocks.",
    cta: {
      content: "Block a deep-work session",
      action: "/",
    },
  },
  {
    archetype: "Balanced Explorer",
    icon: <SparklesIcon size={75} />,
    description:
      "You thrive on variety but still need structure. Mix 2-3 subjects per day with clear start and end times.",
    cta: {
      content: "Design today's study mix",
      action: "/",
    },
  },
];

export default function InsightOfTheDaySection() {
  return (
    <Card className="flex-2 pb-0 max-w-[40%] max-lg:max-w-full">
      <h2 className="text-center text-4xl max-md:text-2xl font-semibold">
        Daily Insight
      </h2>
      <div className="flex flex-col h-full">
        <InsightComponent insights={insights} />
      </div>
    </Card>
  );
}
