import {
  BookHeartIcon,
  FocusIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react";

const titleContent = "How Clarity helps you learn faster";

const contentElements = [
  {
    title: "Guided Lessons",
    content:
      "Personalized, step-by-step lessons that adapt to your pace and keep you on track.",
    ElIcon: BookHeartIcon,
  },
  {
    title: "Smart Focus UI",
    content:
      "A clean, minimal interface built for students who get overwhelmed easily.",
    ElIcon: FocusIcon,
  },
  {
    title: "AI Tailored Feedback",
    content:
      "Instant help based on your mistakes, learning style, and progress.",
    ElIcon: SparklesIcon,
  },
  {
    title: "Motivation Reinvented",
    content:
      "Small wins, progress tracking, and gentle reinforcement that keeps you moving.",
    ElIcon: TrophyIcon,
  },
];

export default function LandingPageCoreFeaturesSection() {
  return (
    <section className="bg-primary-foreground border-t-2 py-10 flex items-center gap-10 flex-col">
      <h2 className="font-bold text-4xl text-center px-5 max-sm:text-3xl">
        {titleContent}
        <hr className="mt-5 border-2 border-dashed border-accent-foreground opacity-60 max-sm:w-[80%] m-auto" />
      </h2>
      <div className="flex w-[60%] m-auto justify-center max-lg:flex-col max-lg:w-[90%]">
        {contentElements.map(({ title, content, ElIcon }, key) => {
          return (
            <div
              className={`${
                key != contentElements.length - 1
                  ? "max-lg:border-b-2 max-lg:border-r-transparent max-lg:dark:border-r-transparent border-r-2"
                  : ""
              } flex flex-col flex-1 items-center gap-3 max-lg:py-4`}
              key={key}
            >
              <div className="w-15 h-15 rounded-full flex justify-center">
                <ElIcon className="text-primary" size={"3.5rem"} />
              </div>
              <h3 className="font-bold text-xl text-center px-2">{title}</h3>
              <p className="w-[70%] text-center">{content}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
