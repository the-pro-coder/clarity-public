"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/custom/prefabs/InputField";
import { ArrowBigLeft, ArrowBigRight, BookOpenIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Profile } from "@/utils/supabase/tableTypes";
import capitalize from "@/components/custom/util/Capitalize";

const interestAreasDB = ["math", "english"];
const numberDB = ["one", "two", "three", "four"];

export default function GetStartedPage() {
  const router = useRouter();

  const totalPages = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [confidenceStatus, setConfidenceStatus] = useState<
    {
      area: string;
      status: "confident" | "okay" | "struggle" | "deficient";
    }[]
  >([]);

  const [dedicationTime, setDedicationTime] = useState<
    "5" | "10" | "15" | "30" | "45+"
  >();
  const [grade, setGrade] = useState<"9th" | "10th" | "11th" | "12th">();

  function toggleAreaButton(area: string) {
    if (interestAreas.includes(area)) {
      setConfidenceStatus((prev) => {
        const newConfidenceStatus = prev.filter(({ area: registeredArea }) => {
          return registeredArea != area;
        });
        return [...newConfidenceStatus];
      });
      setInterestAreas((prev) => {
        const newAreas = prev.filter((el) => el != area);
        return [...newAreas];
      });
    } else {
      setInterestAreas((prev) => {
        const newAreas = [...prev, area];
        return newAreas;
      });
    }
  }

  function validateCanContinue(currentPage: number) {
    for (
      let i = 0;
      i < (pages[currentPage - 1].dependencies?.length || 0);
      i++
    ) {
      const dependencies = pages[currentPage - 1].dependencies;
      if (dependencies != null) {
        const dependency = dependencies[i];
        if (dependency?.length != null) {
          if (dependency.length > 0) {
            continue;
          } else {
            return false;
          }
        } else if (dependency == null || dependency == undefined) {
          return false;
        }
        continue;
      }
    }
    return true;
  }

  const pages = [
    {
      title: "Tell us about you",
      subtitle: "Tell us a bit about yourself to personalize your experience.",
      content: (
        <Fragment>
          <div className="flex gap-4">
            <InputField
              label="name"
              placeholder="Your name"
              type="text"
              valueBinding={name}
              binding={setName}
              required
            />
            <InputField
              label="last_name"
              placeholder="Your last name"
              type="text"
              binding={setLastName}
              valueBinding={lastName}
              required
            />
          </div>
          <div className="w-full">
            <InputField
              label="public_username"
              placeholder="Your username"
              type="text"
              binding={setUsername}
              valueBinding={username}
              required
            />
            <p className="text-secondary text-sm font-medium">
              Don&apos;t include your real name
            </p>
          </div>
        </Fragment>
      ),
      dependencies: [name, lastName, username],
    },
    {
      title: "Learning Preferences",
      subtitle: "Help us customize your learning journey",
      content: (
        <Fragment>
          <div className="w-full flex flex-col gap-3">
            <label
              className="font-semibold text-md text-secondary"
              htmlFor="current_focus_time"
            >
              How much time can you dedicate?{" "}
              <span className="text-destructive"> *</span>
            </label>
            <Select
              onValueChange={(value: "5" | "10" | "15" | "30" | "45+") => {
                setDedicationTime(value);
              }}
              value={dedicationTime}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a timespan that fits you" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time</SelectLabel>
                  <SelectItem value="5">5 minutes/day</SelectItem>
                  <SelectItem value="10">10 minutes/day</SelectItem>
                  <SelectItem value="15">15 minutes/day</SelectItem>
                  <SelectItem value="30">30 minutes/day</SelectItem>
                  <SelectItem value="45+">45+ minutes/day</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex flex-col gap-3">
            <label
              className="font-semibold text-secondary"
              htmlFor="current_focus_time"
            >
              What do you want to learn?{" "}
              <span className="text-destructive text-base"> * </span>
              <span className="font-medium text-[12px] max-sm:block">
                (Select all that apply)
              </span>
            </label>
            <div className="flex flex-wrap w-full gap-2">
              {interestAreasDB.map((area, i) => {
                return (
                  <Button
                    onClick={() => {
                      toggleAreaButton(area);
                    }}
                    key={i}
                    className={`border max-sm:text-sm max-sm:px-3 rounded-full ${
                      interestAreas.includes(area) ? " border-primary" : ""
                    }`}
                    variant={
                      interestAreas.includes(area) ? "default" : "outline"
                    }
                  >
                    {capitalize(area)}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <label
              className="font-semibold text-md text-secondary"
              htmlFor="current_focus_time"
            >
              What is your grade?<span className="text-destructive"> *</span>
            </label>
            <Select
              onValueChange={(value: "9th" | "10th" | "11th" | "12th") => {
                setGrade(value);
              }}
              value={grade}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>High School Grade</SelectLabel>
                  <SelectItem value="9th">Freshman (9th grade)</SelectItem>
                  <SelectItem value="10th">Sophomore (10th grade)</SelectItem>
                  <SelectItem value="11th">Junior (11th grade)</SelectItem>
                  <SelectItem value="12th">Senior (12th grade)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Fragment>
      ),
      dependencies: [dedicationTime, interestAreas, grade],
    },
    {
      title: "Almost there!",
      subtitle: `${
        numberDB.length > interestAreas.length
          ? `${capitalize(numberDB[Math.max(interestAreas.length - 1, 0)])}   `
          : "Some "
      }  last question${
        interestAreas.length > 1 ? "s" : ""
      } to tailor your experience`,
      content: (
        <Fragment>
          {interestAreas.map((area, i) => {
            return (
              <div key={i} className="w-full flex flex-col gap-3">
                <label
                  className="font-semibold text-md text-secondary"
                  htmlFor="current_focus_time"
                >
                  How do you feel about {area}?
                  <span className="text-destructive"> *</span>
                </label>
                <Select
                  onValueChange={(
                    value: "confident" | "okay" | "struggle" | "deficient"
                  ) => {
                    const craftedValue = { area: area, status: value };
                    setConfidenceStatus((prev) => [...prev, craftedValue]);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a level of confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Confidence level</SelectLabel>
                      <SelectItem value="confident">
                        I feel confident
                      </SelectItem>
                      <SelectItem value="okay">I feel okay</SelectItem>
                      <SelectItem value="struggle">
                        I usually struggle
                      </SelectItem>
                      <SelectItem value="deficient">I&apos;m lost</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </Fragment>
      ),
    },
  ];

  function pushData() {
    const supabase = createSupabaseBrowserClient();
    supabase.auth
      .getUser()
      .then((data) => {
        return data.data.user;
      })
      .then((user) => {
        console.log(user);
        const dataToInsert: Profile = {
          user_id: user?.id || "",
          name,
          last_name: lastName,
          public_username: username,
          grade_level: grade || "",
          dedication_time: dedicationTime || "",
          interest_areas: interestAreas,
          confidence_status: confidenceStatus,
        };
        supabase
          .from("Profiles")
          .insert(dataToInsert)
          .then(() => {
            router.replace("/dashboard");
          });
      })
      .catch(() => {
        return toast.error("An error ocurred while creating your profile", {
          description: "Please try again",
          position: "top-center",
        });
      });
  }

  return (
    <main className="w-full h-[90dvh]">
      <Progress value={(currentPage / 3) * 100} />
      <div className="flex h-full pt-15 flex-col items-center gap-5 justify-center">
        <div className="bg-blue-200 dark:bg-primary py-2 px-4 flex gap-2 rounded-full">
          <BookOpenIcon className="text-primary dark:text-blue-200" />
          <span className="text-primary dark:text-blue-200 font-semibold">
            Step {currentPage} of {totalPages}
          </span>
        </div>
        <Card className="max-w-md mb-10 w-[90%] px-10 pb-7 flex flex-col items-center">
          <h2 className="text-center font-bold text-3xl max-sm:text-2xl">
            {currentPage - 1 < pages.length && pages[currentPage - 1].title}
          </h2>
          <p className="text-secondary text-center -mt-4 -mb-2 max-sm:text-sm">
            {currentPage - 1 < pages.length && pages[currentPage - 1].subtitle}
          </p>
          {currentPage - 1 < pages.length && pages[currentPage - 1].content}
          <div className="flex justify-between w-full">
            <Button
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
              }}
              disabled={currentPage == 1}
              variant={"outline"}
            >
              <ArrowBigLeft />
              Back
            </Button>
            <Button
              onClick={() => {
                if (currentPage < totalPages) {
                  if (currentPage == totalPages - 1) {
                    setConfidenceStatus([]);
                  }
                  const canContinue = validateCanContinue(currentPage);
                  if (canContinue) setCurrentPage((prev) => prev + 1);
                  else {
                    return toast.error(
                      "Please fill out all the required fields",
                      {
                        position: "top-center",
                      }
                    );
                  }
                } else {
                  // send action
                  let canContinue = true;
                  for (const area of interestAreas) {
                    if (
                      confidenceStatus.find((element) => element.area == area)
                    ) {
                      continue;
                    } else {
                      canContinue = false;
                      break;
                    }
                  }
                  console.log(confidenceStatus);
                  if (canContinue) {
                    pushData();
                  } else {
                    return toast.error(
                      "Please fill out all the required fields",
                      {
                        position: "top-center",
                      }
                    );
                  }
                }
              }}
            >
              {currentPage < totalPages ? "Next" : "Finish"}
              {currentPage < totalPages && <ArrowBigRight />}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
