import { Button } from "@/components/ui/button";
import { Insight } from "./InsightOfTheDaySection";
import Link from "next/link";
export default function InsightComponent({
  insights,
}: {
  insights: Insight[];
}) {
  return (
    <div className="flex-1 h-full flex flex-col max-md:gap-0 max-lg:gap-5">
      {insights.map((insight, i) => {
        return (
          <div
            key={i}
            className={`flex flex-col ${
              i < insights.length - 1 ? "border-b" : ""
            } w-full h-full`}
          >
            <div className="flex max-md:flex-col lg:flex-col flex-1 gap-2 items-center w-9/10 mx-auto border-y-accent">
              <div
                className={`flex-1 max-md:mb-2 ${
                  i != 0 ? "max-md:mt-6 lg:mt-6" : "max-md:mt-0 lg:mt-0"
                } flex items-center justify-center text-primary`}
              >
                {insight.icon}
              </div>
              <div className="flex text-center max-w-full flex-4 max-lg:gap-2 flex-col">
                <h2 className="font-bold max-md:text-xl text-primary max-md:text-center text-2xl">
                  {insight.archetype}
                </h2>
                <h2 className="text-lg max-md:text-base">
                  {insight.description}
                </h2>
                {insight.cta?.action && (
                  <Link href={insight.cta?.action} className="w-full">
                    <Button className="px-3 py-2 mt-2 mb-4 w-full">
                      {insight.cta.content}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
