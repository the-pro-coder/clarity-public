"use client";
import { ResponsiveLine, LineSeries } from "@nivo/line";
export default function LineChart({
  data,
  title,
  colors,
  xLabel,
  yLabel,
}: {
  data: LineSeries[];
  title: string;
  colors?: string[];
  xLabel: string;
  yLabel: string;
}) {
  return (
    <div className="flex h-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        colors={colors ? colors : undefined}
        axisBottom={{ legend: xLabel || "", legendOffset: 36 }}
        axisLeft={{ legend: yLabel, legendOffset: -40 }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 22,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
}
