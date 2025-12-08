"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import capitalize from "../util/Capitalize";
import { Lesson } from "./LessonCardBig";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Tag from "../util/Tag";
import Image from "next/image";

export type Topic = {
  title: string;
  tags: string[];
  subject: string;
  grade: string;
  description: string;
  content: Lesson[];
};

export type Unit = {
  title: string;
  number?: number;
  subject: string;
  tags: string[];
  grade: string;
  description: string;
  imageURL?: string;
  content: Topic[];
};

export default function RecommendedContent({
  interestSubjects,
  suggestedUnits,
}: {
  interestSubjects: string[];
  suggestedUnits: Unit[];
}) {
  const [activeSubject, setActiveSubject] = useState(interestSubjects[0]);
  const [api, setApi] = useState<CarouselApi | null>();
  useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);
  return (
    <Card className="flex-3 max-w-[60%]">
      <h2 className="text-center text-4xl font-semibold">
        Recommended Content
      </h2>
      <div className="gap-3 w-4/5 mx-auto">
        <div className="px-7 flex gap-3">
          {interestSubjects.map((subject, i) => {
            return (
              <Button
                key={i}
                size={"lg"}
                className={`text-2xl py-6 rounded-full ${
                  activeSubject == subject ? "border border-primary" : ""
                }`}
                variant={activeSubject == subject ? "default" : "outline"}
                onClick={() => {
                  api?.scrollTo(0);
                  setActiveSubject(subject);
                }}
              >
                {capitalize(subject)}
              </Button>
            );
          })}
        </div>
      </div>
      <Carousel setApi={setApi} className="max-w-4/5 mx-auto">
        <CarouselContent>
          {suggestedUnits
            .filter((suggestedUnit) => suggestedUnit.subject == activeSubject)
            .map((suggestedUnit, i) => {
              if (i < 5) {
                return (
                  <CarouselItem key={i} className="flex flex-col gap-3">
                    <Card className="mx-7 px-7 pb-4 flex flex-col">
                      <h2 className="font-medium text-3xl flex items-center gap-3">
                        <span className="flex-3">{suggestedUnit.title}</span>
                        <span className="flex flex-2 gap-1 h-full items-start text-lg flex-wrap">
                          {suggestedUnit.tags.map((tag, k) => {
                            return (
                              <Tag key={k} className="px-2 py-1">
                                {capitalize(tag)}
                              </Tag>
                            );
                          })}
                        </span>
                      </h2>
                      <p className="text-xl">{suggestedUnit.description}</p>
                      <div className="flex gap-3">
                        <Image
                          src={
                            suggestedUnit.imageURL ||
                            `/dashboard/recommended-units/default ${i + 1}.png`
                          }
                          alt="Unit Image"
                          width={250}
                          height={220}
                        />
                        <div className="text-lg">
                          <p className="font-bold">Content:</p>
                          <ul className="pl-8">
                            {suggestedUnit.content.map((topic, k) => {
                              return (
                                <li key={k} className="list-disc">
                                  {topic.title}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end -mt-5">
                        <Button className="py-5 text-lg">Add to Track</Button>
                      </div>
                    </Card>
                  </CarouselItem>
                );
              }
            })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
}
