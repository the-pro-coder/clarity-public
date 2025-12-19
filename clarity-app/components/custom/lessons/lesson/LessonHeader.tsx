import { ClockIcon } from "lucide-react";
import BackButton from "./BackButton";
import capitalize from "../../util/Capitalize";

export default function LessonHeader({
  data,
}: {
  data: {
    lessonTitle: string;
    duration: number;
  };
}) {
  return (
    <header className="border-b w-full py-1">
      <div className="flex w-65/100 max-md:w-full m-auto h-15 items-center justify-center">
        <div className="flex-1">
          <div className="flex justify-center">
            <BackButton
              promptMsg={{
                title: "Save and quit?",
                description:
                  "Your progress in this section will be saved. You can continue where you left off anytime.",
              }}
              stayButtonText="Keep learning"
              quitButtonText="Save & exit"
              targetRoute="/dashboard"
            />
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <h2 className="text-xl text-primary text-center max-md:text-lg max-sm:text-sm">
            {capitalize(data.lessonTitle)}
          </h2>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center max-md:text-sm">
            <ClockIcon
              className="text-secondary inline mr-1 max-md:hidden"
              size={20}
            />
            <ClockIcon
              className="text-secondary hidden mr-1 max-md:inline"
              size={15}
            />
            <span className="text-secondary">{data.duration} min</span>
          </div>
        </div>
      </div>
    </header>
  );
}
