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
                <p className="flex gap-2 mb-2">
                  <Button
                    variant={"ghost"}
                    className="rounded-full text-secondary"
                  >
                    {lesson.subject}
                  </Button>
                  <Tag>Unit {lesson.unit}</Tag>
                  <Tag>{lesson.topic}</Tag>
                  <Tag>
                    {lesson.category.split(" ").map((word, i) => {
                      return `${capitalize(word)}${
                        i == lesson.category.split(" ").length - 1 ? "" : " "
                      }`;
                    })}
                  </Tag>
                </p>
                <h2 className="text-3xl font-medium">{lesson.title}</h2>
                <p className="flex gap-1.5">
                  {lesson.tags.map((tag, i) => {
                    return (
                      <Tag key={i} color={"other"} className="p-1 other">
                        {capitalize(tag)}
                      </Tag>
                    );
                  })}
                </p>
                <p className="text-lg">You will {lesson.expectedLearning}</p>
                <div className="flex justify-end">
                  <Button className="text-lg" size={"lg"}>
                    Add to Track
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
