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
    <Card
      className={`flex-3 max-w-[60%] max-lg:max-w-full mx-auto max-lg:flex-1 max-lg:w-full`}
    >
      <h2 className="text-center max-md:text-2xl text-4xl font-semibold">
        Recommended Content
      </h2>
      <div className="gap-3 w-4/5 max-lg:w-full mx-auto">
        <div className="px-7 max-lg:flex-wrap max-lg:px-0 max-lg:gap-1.5 flex gap-3 max-lg:max-w-93/100 max-lg:mx-auto">
          {interestSubjects.map((subject, i) => {
            return (
              <Button
                key={i}
                size={"lg"}
                className={`text-2xl max-md:text-lg max-md:py-4 max-md:px-4 py-6 rounded-full ${
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
      <Carousel
        setApi={setApi}
        className="max-w-4/5 max-lg:max-w-97/100 mx-auto"
      >
        <CarouselContent>
          {suggestedUnits
            .filter((suggestedUnit) => suggestedUnit.subject == activeSubject)
            .map((suggestedUnit, i) => {
              if (i < 5) {
                return (
                  <CarouselItem
                    key={i}
                    className="flex flex-col gap-3 max-md:h-fit"
                  >
                    <Card className="mx-7 max-md:w-9/10 max-md:mx-auto px-7 pb-4 max-md:py-2 max-md:px-2 flex flex-col max-md:gap-4">
                      <h2 className="font-medium max-md:text-xl max-lg:text-2xl text-3xl flex items-center gap-3 max-md:gap-1">
                        <span className="flex-3 max-md:flex-2 text-wrap">
                          <span className="block mb-2">
                            {suggestedUnit.title}
                          </span>
                          <span className="flex gap-1 flex-wrap">
                            {suggestedUnit.tags.map((tag, k) => {
                              return (
                                <Tag
                                  key={k}
                                  className="text-base py-1 max-md:text-sm"
                                >
                                  {capitalize(tag)}
                                </Tag>
                              );
                            })}
                          </span>
                        </span>
                      </h2>
                      <p className="text-xl max-md:text-sm">
                        {suggestedUnit.description}
                      </p>
                      <div className="flex gap-3 items-start">
                        <Image
                          src={
                            suggestedUnit.imageURL ||
                            `/dashboard/recommended-units/default ${i + 1}.png`
                          }
                          alt="Unit Image"
                          className="object-contain max-xl:hidden xl:visible"
                          width={250}
                          height={220}
                        />
                        <Image
                          src={
                            suggestedUnit.imageURL ||
                            `/dashboard/recommended-units/default ${i + 1}.png`
                          }
                          alt="Unit Image"
                          className="object-contain max-lg:hidden xl:hidden"
                          width={100}
                          height={100}
                        />
                        <div className="text-lg max-md:text-base">
                          <p className="font-bold">Content:</p>
                          <ul className="pl-8 max-md:pl-6">
                            {suggestedUnit.content.map((topic, k) => {
                              return (
                                <li key={k} className="list-disc flex-2">
                                  <Collapsible>
                                    <CollapsibleTrigger className="my-2 max-md:my-1">
                                      <button className="text-base border-2 hover:bg-primary hover:border-primary hover:text-primary-foreground border-accent max-w-full rounded-md px-2 py-2 transition-colors max-md:text-sm max-lg:text-base max-sm:text-[11px]">
                                        <span className="w-full">
                                          {topic.title}
                                        </span>
                                      </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pb-2">
                                      {topic.content.map((lesson, j) => {
                                        return (
                                          <div
                                            key={j}
                                            className="flex p-2 shadow-accent shadow-lg border border-0.5  my-1 cursor-pointer rounded-lg justify-between hover:bg-accent transition-colors"
                                          >
                                            <p className="flex items-center gap-2 text-primary font-medium text-base max-md:text-xs">
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
                      <div className="flex justify-end -mt-5 max-md:mt-0">
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
