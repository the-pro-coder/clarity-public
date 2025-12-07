import { Card } from "@/components/ui/card";
import ExploreLessonsCard from "./ExploreLessonsCard";
import { Lesson } from "./LessonCardBig";

const lessons: Lesson[] = [
  {
    subject: "Math",
    unit: 2,
    grade: "12th",
    title: "Derivatives: A sweet delve into change",
    topic: "Differential Calculus",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "What is a derivative?",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "The exponential formula",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Your first derivative!",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "What is a constant in differential calculus?",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Derivative of a constant",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "understand what are derivatives and how they shape modern calculus",
    tags: ["calculus", "change", "fun"],
    status: "not started",
    percentageCompleted: 0,
  },
  {
    subject: "Math",
    unit: 2,
    grade: "12th",
    title: "The Chain Rule: Unlocking Complex Functions",
    topic: "Differential Calculus",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "What is the Chain Rule?",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "The Power of Composition in Calculus",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Applying the Chain Rule to Functions",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "Inverse Functions and Their Derivatives",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Chain Rule with Inverses",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "explore how the Chain Rule simplifies the differentiation of composite functions.",
    tags: ["calculus", "chain rule", "composition"],
    status: "not started",
    percentageCompleted: 0,
  },
  {
    subject: "Math",
    unit: 2,
    grade: "12th",
    title: "Implicit Differentiation: Unraveling the Hidden Derivatives",
    topic: "Differential Calculus",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "What is Implicit Differentiation?",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "When Do We Use Implicit Differentiation?",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Differentiating Implicit Functions",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "The Chain Rule in Implicit Differentiation",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Implicit Differentiation in Action",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "get a deep dive into differentiating equations where the dependent and independent variables are intertwined.",
    tags: ["calculus", "implicit differentiation", "advanced calculus"],
    status: "not started",
    percentageCompleted: 0,
  },
  {
    subject: "Math",
    unit: 2,
    grade: "12th",
    title: "Applications of Derivatives: Understanding Change",
    topic: "Differential Calculus",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "Critical Points and Their Importance",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "Optimization Problems: Maxima and Minima",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Finding Critical Points and Local Extrema",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "How Derivatives Help in Real-Life Situations",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Solving Optimization Problems",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "use derivatives to solve real-world problems involving maximization and minimization.",
    tags: ["calculus", "optimization", "applications of derivatives"],
    status: "not started",
    percentageCompleted: 0,
  },
  {
    subject: "English",
    unit: 1,
    grade: "12th",
    title: "Literary Analysis: Unlocking the Secrets of Texts",
    topic: "Literary Theory",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "What is Literary Analysis?",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "Key Literary Theories and Approaches",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Applying Literary Theory to Texts",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "Theme, Motif, and Symbolism in Literature",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Analyzing Theme and Symbolism in a Text",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "build a foundational approach to analyzing literature through various theoretical lenses.",
    tags: ["literature", "analysis", "critical thinking"],
    status: "not started",
    percentageCompleted: 0,
  },
  {
    subject: "English",
    unit: 1,
    grade: "12th",
    title: "Rhetorical Devices: Mastering Persuasive Writing",
    topic: "Writing and Composition",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "What are Rhetorical Devices?",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "Types of Rhetorical Devices and Their Uses",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Using Rhetorical Devices in Writing",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "Ethos, Pathos, and Logos in Persuasive Writing",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Crafting Persuasive Arguments with Rhetorical Devices",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "learn how to use rhetorical strategies to enhance writing and argumentation skills.",
    tags: ["writing", "persuasion", "rhetoric"],
    status: "not started",
    percentageCompleted: 0,
  },
  {
    subject: "English",
    unit: 1,
    grade: "12th",
    title: "Narrative Writing: Crafting Compelling Stories",
    topic: "Creative Writing",
    category: "theory & practice",
    lessonSections: [
      {
        type: "theory",
        title: "Elements of a Good Story",
        exp: 100,
        status: "not started",
      },
      {
        type: "theory",
        title: "Character Development and Plot Structure",
        exp: 100,
        status: "not started",
      },
      {
        type: "practice",
        title: "Creating Your Own Narrative",
        exp: 125,
        status: "not started",
      },
      {
        type: "theory",
        title: "Setting, Theme, and Conflict in Narratives",
        exp: 75,
        status: "not started",
      },
      {
        type: "practice",
        title: "Building a Narrative from Start to Finish",
        exp: 100,
        status: "not started",
      },
    ],
    expectedLearning:
      "receive an introduction to writing compelling stories and exploring the essential components of narrative.",
    tags: ["creative writing", "storytelling", "narrative"],
    status: "not started",
    percentageCompleted: 0,
  },
];

export default function ExploreLessons() {
  return (
    <Card>
      <h2 className="text-center text-3xl font-semibold">Explore Lessons</h2>
      <div className="w-6/7 px-2 m-auto">
        <ExploreLessonsCard lessons={lessons} />
      </div>
    </Card>
  );
}
