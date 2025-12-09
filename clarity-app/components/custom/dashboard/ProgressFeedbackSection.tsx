import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import CircularProgress from "@/components/ui/progress-circular";
import capitalize from "../util/Capitalize";
import ChartBar from "../prefabs/Feedback/BarChart";

const progressStartData = [
  {
    area: "Trigonometry",
    subject: "math",
    progress: Math.floor((5 / 6) * 100),
    fill: "var(--chart-2)",
  },
  {
    area: "Trigonometric Identities",
    subject: "math",
    progress: Math.floor((2 / 3) * 100),
  },
  {
    area: "Storytelling",
    subject: "english",
    progress: Math.floor((7 / 8) * 100),
  },
  {
    area: "Analyzing Context",
    subject: "english",
    progress: Math.floor((1 / 6) * 100),
  },
];

const barChartData = [
  { day: "Monday", grade: 40, fill: "var(--chart-1)" },
  { day: "Tuesday", grade: 60, fill: "var(--chart-2)" },
  { day: "Wednesday", grade: 30, fill: "var(--chart-3)" },
  { day: "Thursday", grade: 70, fill: "var(--chart-4)" },
  { day: "Friday", grade: 75, fill: "var(--chart-5)" },
];

const charts = [
  {
    chart: (
      <ChartBar
        className="w-[90%]"
        xLabel="day"
        yLabel="grade"
        dates="December 8th - 15th 2025"
        description="your performance in english during the week"
        chartData={barChartData}
        AIReport="You started harsh, but performed better after Wednesday"
        title="Weekly Performance"
        isPositive={true}
      />
    ),
  },
];

export default function ProgressFeedbackSection({
  className,
}: {
  className: string;
}) {
  return (
    <Card className={`h-full ${className}`}>
      <h2 className="text-center text-4xl font-semibold">Your Progress</h2>
      <Carousel className="mx-auto w-5/6">
        <CarouselContent className="w-full">
          <CarouselItem className="grid grid-cols-2 gap-10 grid-rows-2 px-4">
            {progressStartData.map((dataEl, i) => {
              return (
                <div className="flex flex-col items-center" key={i}>
                  <p className="text-secondary font-semibold text-xl">
                    {capitalize(dataEl.subject)}
                  </p>
                  <CircularProgress
                    value={dataEl.progress}
                    size={200}
                    strokeWidth={25}
                  />
                  <h3 className="text-xl font-medium -mt-1">{dataEl.area}</h3>
                  <p className="text-center text-lg">{dataEl.progress}%</p>
                </div>
              );
            })}
          </CarouselItem>
          {charts.map((chart, i) => {
            return (
              <CarouselItem
                key={i}
                className="flex pl-0 max-w-[95%] mx-auto justify-center items-center"
              >
                {chart.chart}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
}
