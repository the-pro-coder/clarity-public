import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Lesson } from "./LessonCardBig";
import Tag from "../util/Tag";
import capitalize from "../util/Capitalize";
export default function ExploreLessonsCard({ lessons }: { lessons: Lesson[] }) {
  return (
    <Carousel className="m-auto">
      <CarouselContent>
        {lessons.map((lesson: Lesson, i) => {
          return (
            <CarouselItem key={i}>
              <Card className="flex p-4 flex-col gap-3">
                <p className="flex gap-2 mb-2 flex-wrap">
                  <Button
                    variant={"ghost"}
                    className="rounded-full text-secondary"
                  >
                    {lesson.subject}
                  </Button>
                  <Tag className="max-md:text-xs max-lg:py-2">
                    Unit {lesson.unit}
                  </Tag>
                  <Tag className="max-md:text-xs max-lg:py-2">
                    {lesson.topic}
                  </Tag>
                  <Tag className="max-md:text-xs max-lg:py-2">
                    {lesson.category.split(" ").map((word, i) => {
                      return `${capitalize(word)}${
                        i == lesson.category.split(" ").length - 1 ? "" : " "
                      }`;
                    })}
                  </Tag>
                </p>
                <h2 className="text-3xl max-lg:text-lg font-medium">
                  {lesson.title}
                </h2>
                <p className="flex max-lg:text-xs max-lg:flex-wrap gap-1.5">
                  {lesson.tags.map((tag, i) => {
                    return (
                      <Tag key={i} color={"other"} className="p-1 other">
                        {capitalize(tag)}
                      </Tag>
                    );
                  })}
                </p>
                <p className="text-lg max-lg:text-base">
                  You will {lesson.expectedLearning}
                </p>
                <div className="flex justify-end">
                  <Button
                    className="text-lg max-lg:text-base max-lg:px-4"
                    size={"lg"}
                  >
                    Add to Unit
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
