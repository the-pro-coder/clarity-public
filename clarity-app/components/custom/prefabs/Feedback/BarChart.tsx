"use client";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
export default function BarChart({
  data,
  title,
  colors,
  xLabel,
  yLabels,
}: {
  data: BarDatum[];
  title: string;
  colors?: string[];
  xLabel: string;
  yLabels: string[];
}) {
  return (
    <div className="flex h-full">
      <ResponsiveBar /* or Bar for fixed dimensions */
        data={data}
        indexBy={xLabel}
        colors={colors || undefined}
        labelSkipWidth={12}
        labelSkipHeight={12}
        keys={yLabels}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "column",
            translateX: 120,
            itemsSpacing: 3,
            itemWidth: 100,
            itemHeight: 16,
          },
        ]}
        axisBottom={{ legend: xLabel, legendOffset: 32 }}
        axisLeft={{ legend: yLabels.join(" - "), legendOffset: -40 }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      />
    </div>
  );
}
