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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { BicepsFlexed, BookIcon, EyeIcon } from "lucide-react";

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
                          className="object-contain"
                          width={250}
                          height={220}
                        />
                        <div className="text-lg">
                          <p className="font-bold">Content:</p>
                          <ul className="pl-8">
                            {suggestedUnit.content.map((topic, k) => {
                              return (
                                <li key={k} className="list-disc">
                                  <Collapsible>
                                    <CollapsibleTrigger className="my-2">
                                      <span className="text-xl rounded-md px-2  py-2 hover:bg-accent transition-colors">
                                        {topic.title}
                                      </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pb-2">
                                      {topic.content.map((lesson, j) => {
                                        return (
                                          <div
                                            key={j}
                                            className="flex p-2 shadow-accent shadow-lg border border-0.5  my-1 cursor-pointer rounded-lg justify-between hover:bg-accent transition-colors"
                                          >
                                            <p className="flex items-center gap-2 text-primary font-medium text-[16px]">
                                              {lesson.category ==
                                                "analysis" && <EyeIcon />}
                                              {lesson.category ==
                                                "hands-on practice" && (
                                                <BicepsFlexed />
                                              )}
                                              {lesson.category ==
                                                "theory & practice" && (
                                                <BookIcon />
                                              )}
                                              {lesson.title}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </CollapsibleContent>
                                  </Collapsible>
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
