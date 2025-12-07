"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function ChartBar({
  title,
  description,
  xLabel,
  chartData,
  dates,
  AIReport,
  isPositive,
  yLabel,
  className,
}: {
  title: string;
  description: string;
  xLabel: string;
  yLabel: string;
  dates: string;
  chartData: object[];
  AIReport: string;
  isPositive: boolean;
  className?: string;
}) {
  const chartConfig = {
    [yLabel]: {
      label: yLabel,
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{dates}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xLabel}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={yLabel} fill="var(--color-primary)" radius={8}>
              <LabelList
                position="insideTop"
                offset={12}
                className="fill-foreground text-xl font-bold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div
          className={`flex gap-2 leading-none font-medium ${
            isPositive ? "text-emerald-500" : "text-destructive"
          }`}
        >
          {AIReport}{" "}
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing {description}
        </div>
      </CardFooter>
    </Card>
  );
}
