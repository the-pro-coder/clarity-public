import { Lesson } from "@/components/custom/dashboard/LessonCardBig";
import LessonContent from "@/components/custom/lessons/lesson/LessonContent";
import LessonHeader from "@/components/custom/lessons/lesson/LessonHeader";
import { Fragment } from "react/jsx-runtime";
const dummyLesson1: Lesson = {
  subject: "Math",
  unit: 2,
  approximateDuration: 10,
  topic: "Trigonometric Identities",
  lessonId: "Dummy_lesson_456",
  title: "Cosine: Sine's brother",
  status: "in progress",
  grade: "10th",
  category: "theory & practice",
  tags: ["triangles", "pithagoras", "angles", "identities"],
  percentageCompleted: 0,
  expectedLearning:
    "explore cosine's identity, which shows the inverse relationship in the triangle from sine.",
  lessonSections: [
    {
      type: "theory",
      title: "What is a cosine?",
      content: {
        type: "theory",
        sentences: [
          "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.",
          " He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.",
          " The bedding was hardly able to cover it and seemed ready to slide off any moment.",
          " His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.",
          ` "What's happened to me?" he thought.`,
        ],
      },
      exp: 50,
      status: "completed",
    },
    {
      type: "theory",
      title: "How to get a cosine?",
      content: {
        type: "theory",
        sentences: [
          " The bedding was hardly able to cover it and seemed ready to slide off any moment.",
          " His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.",
          ` "What's happened to me?" he thought.`,
        ],
      },
      exp: 50,
      status: "completed",
    },
    {
      type: "practice",
      title: "Getting a cosine from a triangle",
      content: {
        type: "practice",
        question: "Which fraction represents one part out of four equal parts?",
        answers: [
          { text: "1/4", correct: true },
          { text: "4/1", correct: false },
          { text: "2/4", correct: false },
          { text: "1/2", correct: false },
        ],
        explanation:
          "A fraction shows how many parts we take out of a whole. The denominator tells us the whole is divided into four equal parts, and the numerator tells us we take one of those parts. That is exactly what one quarter means.",
      },
      exp: 100,
      status: "not started",
    },
    {
      type: "theory",
      title: "How does the cosine relate to the sine?",
      content: {
        type: "theory",
        sentences: [
          " The cosine directly relates to the sine.",
          " His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.",
          ` "What's happened to me?" he thought.`,
        ],
      },
      exp: 50,
      status: "not started",
    },
    {
      type: "practice",
      title: "Inverse trigonometrics",
      content: {
        type: "practice",
        question: "What is the value of x in the equation x + 3 = 7?",
        answers: [
          { text: "4", correct: true },
          { text: "10", correct: false },
          { text: "3", correct: false },
          { text: "7", correct: false },
        ],
        explanation:
          "The equation says x plus three equals seven. To find x, we subtract three from both sides. Seven minus three equals four, so x must be four for the equation to be true.",
      },
      exp: 100,
      status: "not started",
    },
  ],
};

dummyLesson1.percentageCompleted = Math.round(
  (dummyLesson1.lessonSections.filter((lesson) => {
    return lesson.status == "completed";
  }).length /
    dummyLesson1.lessonSections.length) *
    100
);

const dummyLesson2: Lesson = {
  subject: "English",
  unit: 3,
  topic: "Analyzing Context",
  title: "Setting: Context's Heart",
  approximateDuration: 7,
  status: "in progress",
  grade: "12th",
  lessonId: "dummy_id_123",
  category: "analysis",
  tags: ["place", "time", "story"],
  percentageCompleted: 0,
  expectedLearning:
    "understand how setting influences context, and how it shapes what we understand from a text.",
  lessonSections: [
    {
      type: "theory",
      title: "What is setting?",
      exp: 50,
      status: "completed",
    },
    {
      type: "theory",
      title: "How is setting built?",
      exp: 50,
      status: "completed",
    },
    {
      type: "practice",
      title: "Analyzing setting from an example",
      exp: 100,
      status: "completed",
    },
    {
      type: "theory",
      title:
        "Setting's matices: where does it shape context and where does it end",
      exp: 50,
      status: "completed",
    },
    {
      type: "theory",
      title: "The elements of setting",
      exp: 100,
      status: "completed",
    },
    {
      type: "creativity",
      title: "Create your own setting",
      exp: 100,
      status: "not started",
    },
  ],
};

dummyLesson2.percentageCompleted = Math.round(
  (dummyLesson2.lessonSections.filter((lesson) => {
    return lesson.status == "completed";
  }).length /
    dummyLesson2.lessonSections.length) *
    100
);

/* ACTUAL CODE FROM HERE */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const chosenLesson = [dummyLesson1, dummyLesson2].filter((lesson) => {
    console.log(lesson.lessonId);
    if (lesson.lessonId != null) {
      return lessonId == lesson.lessonId;
    }
    return false;
  })[0];

  return (
    <div className="flex flex-col gap-7">
      <LessonHeader
        data={{
          lessonTitle: chosenLesson.title,
          duration: chosenLesson.approximateDuration,
        }}
      />
      <LessonContent lesson={chosenLesson} />
    </div>
  );
}
