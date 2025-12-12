import { ClockIcon } from "lucide-react";
import BackButton from "./BackButton";

export default function LessonHeader({
  data,
}: {
  data: {
    lessonTitle: string;
    duration: number;
  };
}) {
  return (
    <header className="border-b w-full">
      <div className="flex w-3/5 m-auto h-15 items-center justify-center">
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
          <h2 className="text-xl text-primary text-center">
            {data.lessonTitle}
          </h2>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center">
            <ClockIcon className="text-secondary inline mr-1" size={20} />
            <span className="text-secondary">{data.duration} min</span>
          </div>
        </div>
      </div>
    </header>
  );
}
