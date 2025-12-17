import type { Metadata } from "next";
import DashboardHeader from "@/components/custom/dashboard/DashboardHeader";
import {
  Setup,
  GetRowFromTable,
  GetLessons,
  GenerateLesson,
  InsertRowInTable,
  updateRowInTable,
} from "./action";
import { Profile, Preferences } from "@/utils/supabase/tableTypes";
import { Flame } from "lucide-react";
import NextLessonArea from "@/components/custom/dashboard/NextLessonArea";
import ImprovementAreaSection from "@/components/custom/dashboard/ImprovementAreaSection";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExploreTopics from "@/components/custom/dashboard/ExploreTopicsSection";
import AITutorSection from "@/components/custom/dashboard/AITutorSection";
import ProgressFeedbackSection from "@/components/custom/dashboard/ProgressFeedbackSection";

import RecommendedContent from "@/components/custom/dashboard/RecommendedContent";
import InsightOfTheDaySection from "@/components/custom/dashboard/InsightOfTheDaySection";
import { UserResponse } from "@supabase/supabase-js";
import { Unit, Lesson } from "@/utils/supabase/tableTypes";

export const metadata: Metadata = {
  title: "Clarity - Dashboard",
};

const recommendedUnits: Unit[] = [
  {
    title: "Algebra Foundations",
    number: 1,
    tags: ["math", "algebra", "foundations"],
    grade: "9th",
    description:
      "Introductory unit on algebraic thinking and linear relationships.",
    subject: "math",
    content: [
      {
        title: "Linear Equations",
        tags: ["math", "algebra", "linear equations"],
        grade: "9th",
        subject: "math",
        description:
          "Understand and solve basic linear equations in one variable.",
        content: [
          {
            subject: "Math",
            unit: 1,
            topic: "Linear Equations",
            title: "Solving One-Step Equations",
            grade: "9th",
            category: "theory & practice",
            tags: ["equations", "operations", "intro"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will be able to solve one-step linear equations using inverse operations.",
            lessonSections: [
              {
                type: "theory",
                title: "What is an Equation?",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Solve 10 One-Step Equations",
                exp: 40,
                status: "not started",
              },
              {
                type: "creativity",
                title: "Create Your Own Equation Story",
                exp: 30,
                status: "not started",
              },
            ],
          },
          {
            subject: "Math",
            unit: 1,
            topic: "Linear Equations",
            title: "Two-Step and Multi-Step Equations",
            grade: "9th",
            category: "hands-on practice",
            tags: ["equations", "multi-step"],
            status: "in progress",
            percentageCompleted: 40,
            expectedLearning:
              "Students will solve two-step and multi-step equations and check their solutions.",
            lessonSections: [
              {
                type: "theory",
                title: "Combining Like Terms",
                exp: 25,
                status: "completed",
              },
              {
                type: "practice",
                title: "Multi-Step Equation Drills",
                exp: 50,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Functions and Graphs",
        subject: "math",
        tags: ["math", "functions", "graphs"],
        grade: "9th",
        description:
          "Connect tables, equations, and graphs to understand functions.",
        content: [
          {
            subject: "Math",
            unit: 1,
            topic: "Functions and Graphs",
            title: "Introduction to Functions",
            grade: "9th",
            category: "analysis",
            tags: ["functions", "inputs", "outputs"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will identify functions and distinguish them from non-functions.",
            lessonSections: [
              {
                type: "theory",
                title: "Function Notation",
                exp: 30,
                status: "not started",
              },
              {
                type: "practice",
                title: "Is It a Function?",
                exp: 30,
                status: "not started",
              },
            ],
          },
          {
            subject: "Math",
            unit: 1,
            topic: "Functions and Graphs",
            title: "Graphing Linear Functions",
            grade: "9th",
            category: "hands-on practice",
            tags: ["graphs", "slope", "intercept"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will graph linear functions using slope and y-intercept.",
            lessonSections: [
              {
                type: "theory",
                title: "Slope-Intercept Form",
                exp: 25,
                status: "not started",
              },
              {
                type: "practice",
                title: "Plot and Connect the Points",
                exp: 40,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Geometry Essentials",
    number: 2,
    tags: ["math", "geometry", "shapes"],
    grade: "9th",
    subject: "math",
    description: "Core concepts of plane geometry, angles, and area.",
    content: [
      {
        title: "Angles and Triangles",
        subject: "math",
        tags: ["geometry", "angles", "triangles"],
        grade: "9th",
        description: "Explore angle relationships and triangle properties.",
        content: [
          {
            subject: "Math",
            unit: 2,
            topic: "Angles and Triangles",
            title: "Angle Relationships",
            grade: "9th",
            category: "theory & practice",
            tags: ["angles", "complementary", "supplementary"],
            status: "completed",
            percentageCompleted: 100,
            expectedLearning:
              "Students will classify and calculate related angles in geometric figures.",
            lessonSections: [
              {
                type: "theory",
                title: "Types of Angles",
                exp: 20,
                status: "completed",
              },
              {
                type: "practice",
                title: "Angle Puzzle Worksheet",
                exp: 35,
                status: "completed",
              },
            ],
          },
          {
            subject: "Math",
            unit: 2,
            topic: "Angles and Triangles",
            title: "Triangle Sum Theorem",
            grade: "9th",
            category: "analysis",
            tags: ["triangles", "sum of angles"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will use the triangle sum theorem to find missing interior angles.",
            lessonSections: [
              {
                type: "theory",
                title: "Why 180 Degrees?",
                exp: 25,
                status: "not started",
              },
              {
                type: "practice",
                title: "Find the Missing Angle",
                exp: 30,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Reading Comprehension Skills",
    number: 3,
    tags: ["english", "reading", "comprehension"],
    grade: "9th",
    subject: "english",
    description:
      "Build strategies for understanding fiction and nonfiction texts.",
    content: [
      {
        title: "Fiction Reading",
        subject: "english",
        tags: ["english", "fiction", "stories"],
        grade: "9th",
        description: "Analyze characters, setting, and plot in short stories.",
        content: [
          {
            subject: "English",
            unit: 3,
            topic: "Fiction Reading",
            title: "Character and Motivation",
            grade: "9th",
            category: "analysis",
            tags: ["characters", "motivation", "theme"],
            status: "in progress",
            percentageCompleted: 60,
            expectedLearning:
              "Students will infer character traits and motivations from the text.",
            lessonSections: [
              {
                type: "theory",
                title: "Direct vs. Indirect Characterization",
                exp: 25,
                status: "completed",
              },
              {
                type: "practice",
                title: "Annotate a Short Story",
                exp: 35,
                status: "completed",
              },
              {
                type: "creativity",
                title: "Write a Diary Entry as the Character",
                exp: 30,
                status: "not started",
              },
            ],
          },
          {
            subject: "English",
            unit: 3,
            topic: "Fiction Reading",
            title: "Plot and Conflict",
            grade: "9th",
            category: "theory & practice",
            tags: ["plot", "conflict", "story arc"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will map plot structure and identify central conflicts.",
            lessonSections: [
              {
                type: "theory",
                title: "Exposition to Resolution",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Plot Diagram Activity",
                exp: 30,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Nonfiction Reading",
        tags: ["english", "nonfiction", "informational text"],
        subject: "english",
        grade: "9th",
        description:
          "Understand main ideas, supporting details, and author’s purpose.",
        content: [
          {
            subject: "English",
            unit: 3,
            topic: "Nonfiction Reading",
            title: "Identifying Main Idea",
            grade: "9th",
            category: "theory & practice",
            tags: ["main idea", "details"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will determine the main idea and key supporting details in an article.",
            lessonSections: [
              {
                type: "theory",
                title: "What Makes a Main Idea?",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Highlight and Summarize",
                exp: 30,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Writing Strong Paragraphs and Essays",
    number: 4,
    tags: ["english", "writing", "essay"],
    grade: "9th",
    subject: "english",
    description:
      "Develop clear, well-structured paragraphs and multi-paragraph essays.",
    content: [
      {
        title: "Paragraph Writing",
        tags: ["writing", "paragraphs", "structure"],
        grade: "9th",
        subject: "english",
        description:
          "Focus on topic sentences, supporting details, and concluding sentences.",
        content: [
          {
            subject: "English",
            unit: 4,
            topic: "Paragraph Writing",
            title: "Topic Sentences",
            grade: "9th",
            category: "theory & practice",
            tags: ["topic sentence", "focus"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will craft clear topic sentences that state the main idea of a paragraph.",
            lessonSections: [
              {
                type: "theory",
                title: "What Makes a Strong Topic Sentence?",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Rewrite Weak Topic Sentences",
                exp: 30,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Essay Organization",
        tags: ["writing", "essay", "organization"],
        grade: "9th",
        subject: "english",
        description: "Plan and draft a basic five-paragraph essay.",
        content: [
          {
            subject: "English",
            unit: 4,
            topic: "Essay Organization",
            title: "Introduction and Thesis",
            grade: "9th",
            category: "analysis",
            tags: ["thesis", "introduction"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will write engaging introductions that include a clear thesis statement.",
            lessonSections: [
              {
                type: "theory",
                title: "Hook, Context, Thesis",
                exp: 25,
                status: "not started",
              },
              {
                type: "creativity",
                title: "Write Three Different Hooks",
                exp: 25,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Data & Statistics Basics",
    number: 5,
    tags: ["math", "statistics", "data"],
    grade: "9th",
    description:
      "Learn how to collect, organize, and interpret data using basic statistical tools.",
    subject: "math",
    content: [
      {
        title: "Describing Data",
        tags: ["statistics", "mean", "median", "mode"],
        grade: "9th",
        subject: "math",
        description: "Summarize data sets using measures of center and spread.",
        content: [
          {
            subject: "Math",
            unit: 5,
            topic: "Describing Data",
            title: "Mean, Median, and Mode",
            grade: "9th",
            category: "theory & practice",
            tags: ["average", "center", "summary"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will calculate and compare mean, median, and mode for given data sets.",
            lessonSections: [
              {
                type: "theory",
                title: "Measures of Central Tendency",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Compute Averages from Real Data",
                exp: 35,
                status: "not started",
              },
            ],
          },
          {
            subject: "Math",
            unit: 5,
            topic: "Describing Data",
            title: "Range and Interquartile Range",
            grade: "9th",
            category: "analysis",
            tags: ["spread", "range", "IQR"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will describe the spread of data using range and interquartile range.",
            lessonSections: [
              {
                type: "theory",
                title: "Why Spread Matters",
                exp: 25,
                status: "not started",
              },
              {
                type: "practice",
                title: "Find IQR from Box Plots",
                exp: 35,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Displaying Data",
        tags: ["statistics", "graphs"],
        subject: "math",
        grade: "9th",
        description: "Represent data with different types of graphs.",
        content: [
          {
            subject: "Math",
            unit: 5,
            topic: "Displaying Data",
            title: "Bar Graphs and Histograms",
            grade: "9th",
            category: "hands-on practice",
            tags: ["graphs", "histograms"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will create and interpret bar graphs and histograms.",
            lessonSections: [
              {
                type: "theory",
                title: "When to Use Which Graph",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Graphing a Class Survey",
                exp: 40,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Probability & Counting",
    number: 6,
    tags: ["math", "probability", "combinatorics"],
    grade: "9th",
    description: "Explore chance, outcomes, and basic counting strategies.",
    subject: "math",
    content: [
      {
        title: "Introductory Probability",
        subject: "math",
        tags: ["probability", "fractions"],
        grade: "9th",
        description: "Connect fractions and decimals to simple probabilities.",
        content: [
          {
            subject: "Math",
            unit: 6,
            topic: "Introductory Probability",
            title: "Simple Events",
            grade: "9th",
            category: "theory & practice",
            tags: ["simple events", "sample space"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will compute probabilities of simple events using favorable and total outcomes.",
            lessonSections: [
              {
                type: "theory",
                title: "Defining Probability",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Dice and Coin Experiments",
                exp: 40,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Compound Events & Counting",
        tags: ["probability", "counting", "combinations"],
        subject: "math",
        grade: "9th",
        description:
          "Use tree diagrams and basic counting to analyze compound events.",
        content: [
          {
            subject: "Math",
            unit: 6,
            topic: "Compound Events & Counting",
            title: "Tree Diagrams",
            grade: "9th",
            category: "analysis",
            tags: ["compound events", "tree diagrams"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will draw tree diagrams to list outcomes and compute probabilities.",
            lessonSections: [
              {
                type: "theory",
                title: "Visualizing Outcomes",
                exp: 25,
                status: "not started",
              },
              {
                type: "practice",
                title: "Build Trees for Real Scenarios",
                exp: 35,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Quadratic Functions & Equations",
    number: 7,
    tags: ["math", "algebra", "quadratics"],
    grade: "10th",
    description:
      "Study parabolas, quadratic equations, and different solution methods.",
    subject: "math",
    content: [
      {
        title: "Graphs of Quadratic Functions",
        subject: "math",
        tags: ["quadratics", "graphs", "parabolas"],
        grade: "10th",
        description: "Connect equations of quadratics with their graphs.",
        content: [
          {
            subject: "Math",
            unit: 7,
            topic: "Graphs of Quadratic Functions",
            title: "Vertex and Intercepts",
            grade: "10th",
            category: "analysis",
            tags: ["vertex", "intercepts", "transformations"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will identify the vertex and intercepts of a quadratic from its equation and graph.",
            lessonSections: [
              {
                type: "theory",
                title: "Standard vs. Vertex Form",
                exp: 30,
                status: "not started",
              },
              {
                type: "practice",
                title: "Match Graphs to Equations",
                exp: 40,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Solving Quadratic Equations",
        tags: ["quadratics", "factoring", "formula"],
        grade: "10th",
        subject: "math",
        description:
          "Use factoring and the quadratic formula to solve equations.",
        content: [
          {
            subject: "Math",
            unit: 7,
            topic: "Solving Quadratic Equations",
            title: "Factoring Quadratics",
            grade: "10th",
            category: "hands-on practice",
            tags: ["factoring", "zeros"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will factor simple quadratic expressions and solve related equations.",
            lessonSections: [
              {
                type: "theory",
                title: "Common Patterns in Quadratics",
                exp: 25,
                status: "not started",
              },
              {
                type: "practice",
                title: "Solve by Factoring",
                exp: 45,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Intro to Trigonometry",
    number: 8,
    tags: ["math", "trigonometry", "right triangles"],
    grade: "10th",
    description:
      "Use right triangles to define and apply basic trigonometric ratios.",
    subject: "math",
    content: [
      {
        title: "Right Triangle Basics",
        tags: ["triangles", "pythagorean theorem"],
        grade: "10th",
        subject: "math",
        description: "Review right triangles and the Pythagorean Theorem.",
        content: [
          {
            subject: "Math",
            unit: 8,
            topic: "Right Triangle Basics",
            title: "Pythagorean Theorem Applications",
            grade: "10th",
            category: "hands-on practice",
            tags: ["distance", "legs", "hypotenuse"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will solve real-world problems using the Pythagorean Theorem.",
            lessonSections: [
              {
                type: "theory",
                title: "Understanding the Relationship",
                exp: 20,
                status: "not started",
              },
              {
                type: "practice",
                title: "Word Problems with Right Triangles",
                exp: 40,
                status: "not started",
              },
            ],
          },
        ],
      },
      {
        title: "Trigonometric Ratios",
        tags: ["sine", "cosine", "tangent"],
        subject: "math",
        grade: "10th",
        description:
          "Introduce sine, cosine, and tangent as ratios in right triangles.",
        content: [
          {
            subject: "Math",
            unit: 8,
            topic: "Trigonometric Ratios",
            title: "Sine, Cosine, and Tangent",
            grade: "10th",
            category: "theory & practice",
            tags: ["trig ratios", "angles"],
            status: "not started",
            percentageCompleted: 0,
            expectedLearning:
              "Students will use trig ratios to find missing side lengths and angles in right triangles.",
            lessonSections: [
              {
                type: "theory",
                title: "Defining the Ratios",
                exp: 30,
                status: "not started",
              },
              {
                type: "practice",
                title: "Solve for Missing Sides",
                exp: 45,
                status: "not started",
              },
            ],
          },
        ],
      },
    ],
  },
];

// to change later
const streak = 3;

const isLessonActive = true;

export default async function Dashboard() {
  // const [profile, progress, recommendations, settings] = await Promise.all([GetProfile(), GetUser(), GetProgress(), GetRecommendations(), GetSettings()])
  const supabase = await createClient();
  const userResponse: UserResponse = await supabase.auth.getUser();
  if (userResponse.error) {
    console.error(userResponse.error);
    throw userResponse.error;
  }
  const user = await Setup({
    id: userResponse.data.user?.id || "",
    email: userResponse.data.user?.email || "",
  });
  let profile: Profile, preferences: Preferences;
  if (user != null) {
    profile = await GetRowFromTable(`${user.user_id}`, "profiles");
    preferences = await GetRowFromTable(`${user.user_id}`, "preferences");
    const interestSubjects = profile.interest_areas;
    let lessons =
      profile.current_lesson_ids && profile.current_lesson_ids.length > 0
        ? await GetLessons(user.user_id, profile.current_lesson_ids)
        : "not created";
    if (lessons == "not created") {
      lessons = [];
      for (const subject of interestSubjects) {
        const lesson = await GenerateLesson(profile, subject, "diagnostic");
        await InsertRowInTable(lesson, "lessons");
        lessons.push(lesson);
      }
      profile.current_lesson_ids = lessons.map(
        (lesson: Lesson) => lesson.lesson_id
      );
      await updateRowInTable(`${user.user_id}`, profile, "profiles");
    } else if (!lessons) {
      // error fetching lessons
    } else if (typeof lessons != "string") {
      profile.current_lesson_ids = lessons
        .filter((lesson: Lesson) => lesson.status != "completed")
        .map((lesson: Lesson) => lesson.lesson_id);
      if (profile.current_lesson_ids.length < 2) {
        // generate other lessons.
      }
      await updateRowInTable(`${user.user_id}`, profile, "profiles");
    }
    return (
      <main className="flex flex-col gap-10">
        <DashboardHeader name={profile.name} last_name={profile.last_name} />
        <section className="flex max-lg:flex-col gap-15 max-w-4/5 w-4/5 m-auto">
          <div className="flex-3 flex flex-col gap-6 justify-start">
            <section className=" flex flex-col gap-6 max-md:gap-3 ">
              <h2 className="text-6xl max-md:text-4xl flex items-center gap-5">
                <span className="text-nowrap">
                  <span>Hi, {profile?.name ? profile.name + "!" : ""}</span>
                </span>
                {streak >= 3 && (
                  <span className="flex max-md:justify-self-start max-md: hover:bg-accent cursor-default hover:outline-accent transition-colors items-center outline-4 rounded-full max-md:px-2 px-4 py-1 justify-center">
                    <Flame
                      size={50}
                      fill="orange"
                      className="text-destructive max-md:hidden"
                    />
                    <Flame
                      size={25}
                      fill="orange"
                      className="text-destructive md:hidden"
                    />
                    <span className="text-5xl font-bold max-md:text-xl">
                      {streak}
                    </span>
                  </span>
                )}
              </h2>
              <p className="text-2xl max-md:text-base">
                Ready to continue your learning flow?
              </p>
              <h2 className="text-5xl font-bold max-md:text-3xl -mb-2">
                {isLessonActive ? "Continue Learning" : "Your Next Step"}
              </h2>
            </section>
            <section className="flex flex-col">
              {lessons && (
                <NextLessonArea
                  currentLessons={lessons}
                  interestSubjects={interestSubjects}
                />
              )}
            </section>
          </div>
          <section className="flex-2">
            <ImprovementAreaSection maxDisplayableLessons={3} />
          </section>
        </section>
        <section className="flex-1 lg:grid lg:grid-cols-2 max-lg:flex max-lg:flex-col gap-3 mb-10 max-w-4/5 w-4/5 m-auto">
          <section className="flex max-lg:flex-1 flex-col gap-3">
            <ExploreTopics />
            <AITutorSection className="max-lg:hidden" />
            <ProgressFeedbackSection className="lg:hidden" />
          </section>
          <section className="flex max-lg:flex-1 flex-col">
            <ProgressFeedbackSection className="max-lg:hidden" />
            <AITutorSection className="lg:hidden" />
          </section>
        </section>
        <section className="flex-1 max-lg:flex-col flex gap-3 mb-10 max-w-4/5 w-4/5 m-auto">
          <RecommendedContent
            interestSubjects={interestSubjects}
            suggestedUnits={recommendedUnits}
          />
          <InsightOfTheDaySection />
        </section>
      </main>
    );
  } else {
    // return loading skeleton;
    return <h1>Loading</h1>;
  }
}
