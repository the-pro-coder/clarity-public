import {
  GenerateSections,
  GetLesson,
  GetRowFromTable,
  GetUser,
} from "@/app/dashboard/action";
import { Lesson } from "@/components/custom/dashboard/LessonCardBig";
import LessonContent from "@/components/custom/lessons/lesson/LessonContent";
import LessonHeader from "@/components/custom/lessons/lesson/LessonHeader";
import { Fragment } from "react/jsx-runtime";

// const mathLesson: Lesson = {
//   subject: "Math",
//   approximateDuration: 20,
//   unit: 1,
//   topic: "Fractions",
//   title: "Understanding Fractions",
//   grade: "5th Grade",
//   category: "theory & practice",
//   tags: ["fractions", "numerator", "denominator", "basics"],
//   status: "not started",
//   percentageCompleted: 0,
//   expectedLearning:
//     "Understand what fractions represent and correctly identify simple fractions in common situations.",
//   lessonId: "math-fractions-001",
//   lessonSections: [
//     {
//       type: "theory",
//       title: "What Is a Fraction?",
//       exp: 10,
//       status: "not started",
//       content: {
//         type: "theory",
//         sentences: [
//           "A fraction represents a part of a whole.",
//           "The numerator tells how many parts we have.",
//           "The denominator tells how many equal parts the whole is divided into.",
//           "For example, 1/4 means one part out of four equal parts.",
//         ],
//       },
//     },
//     {
//       type: "practice",
//       title: "Identify One Fourth",
//       exp: 15,
//       status: "not started",
//       content: {
//         type: "practice",
//         question: "Which fraction represents one part out of four equal parts?",
//         explanation:
//           "The denominator 4 means the whole is split into four equal pieces, and the numerator 1 means we take one piece: 1/4.",
//         answers: [
//           { text: "1/4", correct: true },
//           { text: "4/1", correct: false },
//           { text: "2/4", correct: false },
//           { text: "1/2", correct: false },
//         ],
//       },
//     },
//     {
//       type: "theory",
//       title: "Equivalent Fractions",
//       exp: 10,
//       status: "not started",
//       content: {
//         type: "theory",
//         sentences: [
//           "Equivalent fractions represent the same value even if they look different.",
//           "You can make equivalent fractions by multiplying or dividing the numerator and denominator by the same number.",
//           "For example, 1/2 is equivalent to 2/4.",
//           "This works because you are scaling the fraction without changing its value.",
//         ],
//       },
//     },
//     {
//       type: "practice",
//       title: "Find an Equivalent Fraction",
//       exp: 15,
//       status: "not started",
//       content: {
//         type: "practice",
//         question: "Which fraction is equivalent to 1/2?",
//         explanation:
//           "An equivalent fraction is made by multiplying numerator and denominator by the same number. 1/2 × 2/2 = 2/4.",
//         answers: [
//           { text: "2/4", correct: true },
//           { text: "1/4", correct: false },
//           { text: "2/3", correct: false },
//           { text: "3/2", correct: false },
//         ],
//       },
//     },
//     {
//       type: "creativity",
//       title: "Fractions in Your World",
//       exp: 25,
//       status: "not started",
//       content: {
//         type: "creativity",
//         instructions:
//           "Write a short paragraph describing a real-life situation where you use fractions (food, time, sports, money, etc.). Include at least two fractions and explain what each fraction means.",
//         tips: [
//           "Use a situation you actually experience (pizza slices, recipe measurements, sharing snacks).",
//           "Explain what the denominator represents (the total equal parts).",
//           "Explain what the numerator represents (how many parts you take).",
//         ],
//         minCharacters: 80,
//       },
//     },
//   ],
// };

// const englishLesson: Lesson = {
//   subject: "English",
//   approximateDuration: 20,
//   unit: 1,
//   topic: "Nouns & Sentences",
//   title: "Building Clear Sentences",
//   grade: "5th Grade",
//   category: "theory & practice",
//   tags: ["nouns", "proper nouns", "sentences", "punctuation"],
//   status: "not started",
//   percentageCompleted: 0,
//   expectedLearning:
//     "Identify common vs proper nouns and recognize what makes a sentence complete and correctly punctuated.",
//   lessonId: "eng-nouns-001",
//   lessonSections: [
//     {
//       type: "theory",
//       title: "Nouns: Common vs Proper",
//       exp: 10,
//       status: "not started",
//       content: {
//         type: "theory",
//         sentences: [
//           "A noun is a word that names a person, place, thing, or idea.",
//           "Common nouns name general people or things (school, city, teacher).",
//           "Proper nouns name specific people or places (Ms. Rivera, Mexico, London).",
//           "Proper nouns always start with a capital letter.",
//         ],
//       },
//     },
//     {
//       type: "practice",
//       title: "Spot the Proper Noun",
//       exp: 15,
//       status: "not started",
//       content: {
//         type: "practice",
//         question: "Which word is a proper noun?",
//         explanation:
//           "A proper noun names a specific place and is capitalized. London is the name of a specific city.",
//         answers: [
//           { text: "city", correct: false },
//           { text: "teacher", correct: false },
//           { text: "London", correct: true },
//           { text: "dog", correct: false },
//         ],
//       },
//     },
//     {
//       type: "theory",
//       title: "What Makes a Sentence?",
//       exp: 10,
//       status: "not started",
//       content: {
//         type: "theory",
//         sentences: [
//           "A sentence expresses a complete idea.",
//           "Most sentences have a subject (who/what) and a predicate (what happens).",
//           "Sentences start with a capital letter.",
//           "Sentences end with punctuation like a period, question mark, or exclamation mark.",
//         ],
//       },
//     },
//     {
//       type: "practice",
//       title: "Pick the Correct Sentence",
//       exp: 15,
//       status: "not started",
//       content: {
//         type: "practice",
//         question: "Which sentence is written correctly?",
//         explanation:
//           "It begins with a capital letter and ends with a question mark because it is a question.",
//         answers: [
//           { text: "where are you going?", correct: false },
//           { text: "Where are you going", correct: false },
//           { text: "Where are you going?", correct: true },
//           { text: "Where are you going.", correct: false },
//         ],
//       },
//     },
//     {
//       type: "creativity",
//       title: "Write a Mini Story",
//       exp: 25,
//       status: "not started",
//       content: {
//         type: "creativity",
//         instructions:
//           "Write a short mini story (3–5 sentences). Use at least one proper noun and at least three common nouns. Make sure every sentence is punctuated correctly.",
//         tips: [
//           "Underline (mentally) your proper noun: a specific person or place.",
//           "Include common nouns like 'dog', 'park', 'backpack', or 'music'.",
//           "Check that each sentence starts with a capital letter and ends with punctuation.",
//         ],
//         minCharacters: 120,
//       },
//     },
//   ],
// };

// mathLesson.percentageCompleted = Math.round(
//   (mathLesson.lessonSections.filter((lesson) => {
//     return lesson.status == "completed";
//   }).length /
//     mathLesson.lessonSections.length) *
//     100
// );

// englishLesson.percentageCompleted = Math.round(
//   (englishLesson.lessonSections.filter((lesson) => {
//     return lesson.status == "completed";
//   }).length /
//     englishLesson.lessonSections.length) *
//     100
// );

/* ACTUAL CODE FROM HERE */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user_id = (await GetUser())?.id;
  const profile = await GetRowFromTable(user_id || "", "profiles");
  let chosenLesson = await GetLesson(user_id || "", lessonId);
  if (!chosenLesson.lesson_sections[0].content) {
    chosenLesson = await GenerateSections(profile, chosenLesson);
  }

  return (
    <div className="flex flex-col gap-7">
      <LessonHeader
        data={{
          lessonTitle: chosenLesson.title,
          duration: chosenLesson.approximate_duration,
        }}
      />
      <LessonContent lesson={chosenLesson} />
    </div>
  );
}
