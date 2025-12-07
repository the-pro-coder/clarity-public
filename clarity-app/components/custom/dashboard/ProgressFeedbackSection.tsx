import { Card } from "@/components/ui/card";
import { BarDatum } from "@nivo/bar";
import BarChart from "../prefabs/Feedback/BarChart";
import ChartColorPalette from "../util/ChartColorPalette";

const data: BarDatum[] = [
  {
    Day: "Monday",
    Grade: 40,
    ExtraPoints: 20,
  },
  {
    Day: "Tuesday",
    Grade: 60,
    ExtraPoints: 10,
  },
  {
    Day: "Wednesday",
    Grade: 70,
    ExtraPoints: 30,
  },
  {
    Day: "Thursday",
    Grade: 50,
    ExtraPoints: 0,
  },
  {
    Day: "Friday",
    Grade: 70,
    ExtraPoints: 20,
  },
];

export default function ProgressFeedbackSection() {
  return (
    <Card className="h-full">
      <h2 className="text-center text-3xl font-semibold">Your Progress</h2>
      <BarChart
        xLabel="Day"
        yLabels={["Grade", "ExtraPoints"]}
        data={data}
        colors={ChartColorPalette}
        title="Monthly Performance"
      />
    </Card>
  );
}
