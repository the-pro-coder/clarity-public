import { Button } from "@/components/ui/button";
import { Insight } from "./InsightOfTheDaySection";
import Link from "next/link";
export default function InsightComponent({
  insights,
}: {
  insights: Insight[];
}) {
  return (
    <div className="flex-1 h-full flex flex-col">
      {insights.map((insight, i) => {
        return (
          <div
            key={i}
            className={`flex flex-col ${
              i < insights.length - 1 ? "border-b" : ""
            } w-full h-full`}
          >
            <div className="flex flex-1 gap-2 items-center w-9/10 mx-auto border-y-accent">
              <div className="flex-1 flex items-center justify-center text-primary">
                {insight.icon}
              </div>
              <div className="flex flex-4 flex-col">
                <h2 className="font-bold text-primary text-2xl">
                  {insight.archetype}
                </h2>
                <h2 className="text-lg">
                  {insight.description}
                  {insight.cta?.action && (
                    <Link href={insight.cta?.action}>
                      <Button className="px-0 pl-1 text-lg" variant={"link"}>
                        {insight.cta.content}
                      </Button>
                    </Link>
                  )}
                </h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
