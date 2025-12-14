"use server";
import {
  Lesson,
  LessonSection,
} from "@/components/custom/dashboard/LessonCardBig";
import capitalize from "@/components/custom/util/Capitalize";
import PromptModel from "@/components/custom/util/LLMIntegration";
import { createClient } from "@/utils/supabase/server";
import { User, Preferences, Profile } from "@/utils/supabase/tableTypes";
import { UserResponse } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
async function alreadyInsertedRow(
  table: string,
  user_id: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .select("user_id")
    .eq("user_id", user_id)
    .maybeSingle(); // returns one row or null

  if (error && error.code !== "PGRST116") {
    // ignore "no rows" error if using older libs
    throw error;
  }

  // if data is not null → row exists
  return !!data;
}
async function InsertRow(
  user_id: string,
  table: string,
  data_to_insert: Profile | User | Preferences
) {
  const supabase = await createClient();
  const inserted = await alreadyInsertedRow(table, user_id);
  if (!inserted) {
    const { data, error } = await supabase
      .from(`${capitalize(table)}`)
      .insert(data_to_insert);
    return { data, error };
  }
}
export async function Setup(user: { id: string; email: string }) {
  if (user != null) {
    const userDataToInsert: User = {
      user_id: user.id,
      email: user.email,
    };
    const response = await InsertRow(user?.id || "", "users", userDataToInsert);
    if (response?.error) {
      throw response.error;
    }
    const preferencesDataToInsert: Preferences = { user_id: user.id };
    const preferencesResponse = await InsertRow(
      user?.id || "",
      "preferences",
      preferencesDataToInsert
    );
    if (preferencesResponse?.error) {
      throw preferencesResponse.error.message;
    }
    const alreadyInsertedProfile = await alreadyInsertedRow(
      "profiles",
      user?.id || ""
    );
    if (!alreadyInsertedProfile) redirect("/dashboard/get-started");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("user_id", user?.id);
    if (!error) return data[0];
  }
}

export async function GetUser() {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  return user;
}

export async function GetRowFromTable(user_id: string, table: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .select("*")
    .eq("user_id", user_id);
  if (!error) return data[0];
}

export async function InsertRowInTable(dataToInsert: object, table: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .insert(dataToInsert);
}
export async function updateRowInTable(
  user_id: string,
  dataToInsert: object,
  table: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .update(dataToInsert)
    .eq("user_id", user_id);
}

export async function GetLesson(user_id: string, lesson_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`Lessons`)
    .select("*")
    .eq("user_id", user_id)
    .eq("lesson_id", lesson_id)
    .single();
  if (!error) return data;
}

export async function GetLessons(user_id: string, lesson_ids: string[]) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`Lessons`)
    .select("*")
    .eq("user_id", user_id)
    .in("lesson_id", lesson_ids);
  if (!error) return data;
}

export async function UpdateLessonSections(
  lesson_id: string,
  new_lesson_sections: Lesson
) {
  const supabase = await createClient();
  await supabase
    .from(`Lessons`)
    .update({
      lesson_sections: new_lesson_sections.lesson_sections,
      approximate_duration: new_lesson_sections.approximate_duration,
    })
    .eq("lesson_id", lesson_id);
}

export async function GenerateSections(profile: Profile, lesson: Lesson) {
  const model_instructions = `
  -Output must be valid JSON.
  -The first character must be { and the last character must be }
  -Output must be a single JSON object.
  -Output must not include markdown, code fences, comments, or any other text.
  -NEVER MENTION ANYTHING REGARDING ADHD.`;

  const model_prompt = `Generate lesson sections for the lesson that has ${JSON.stringify(
    lesson.lesson_sections
  )}:
  - Adapted to the ADHD suffering user's needs & likes.
  - Short but yet complete titles & descriptions.

  OUTPUT FORMAT (DEPENDING ON WHAT TYPE YOU CHOSE) (AVOID USING EXTRA CHARACTERS OTHERS THAN A READY TO PARSE OBJECT):
  approximate_duration:number, (add an approximate duration number, in minutes, for the completion of the lesson based on the user ${JSON.stringify(
    profile
  )} and the number of sections, which is ${
    lesson.lesson_sections.length
  }, PLEASE BE ACCURATE AND DON'T GIVE ENORMOUS TIMES, estimate the time realistically with an aprox. 1-4 min. per section depending on difficulty, if it is more difficult then consider more time per section.)
  lesson_sections_content: (array of section contents)
  for theory type:
  {
    type:'theory'
    sentences:string[],
  }
  for practice type:
  {
    type: 'practice',
    question: string,
    explanation: string,
    answers (4-6 possible answers): {
    text:string,
    correct:boolean,
    }[];
  }
  for creativity type:
  {
    type: 'creativity';
    instructions: string;
    tips (tips for crafting a good creative piece regarding the context): string[];
    minCharacters: number;
  }
  approximate_duration:number (add an approximate duration number, in minutes, for the completion of the lesson`;

  const sections_data_raw = await PromptModel(model_instructions, model_prompt);
  const sections_content = JSON.parse(
    sections_data_raw.content?.substring(
      sections_data_raw.content?.indexOf("{"),
      sections_data_raw.content?.lastIndexOf("}") + 1
    ) || ""
  );
  lesson.lesson_sections = lesson.lesson_sections.map((lesson_section, i) => {
    const section = {
      ...lesson_section,
      content: sections_content["lesson_sections_content"][i],
    };
    return section;
  });
  lesson.approximate_duration = sections_content["approximate_duration"];
  await UpdateLessonSections(lesson.lesson_id, lesson);
  return lesson;
}

export async function GenerateLesson(
  profile: Profile,
  subject: string,
  type: "diagnostic" | "default"
) {
  let model_instructions = `
  -Output must be valid JSON.
  -Output must be a single JSON object.
  -Output must not include markdown, code fences, comments, or any other text.
  -The first character must be { and the last character must be }.`;
  let model_prompt = `Generate a lesson with these specifications:
  - Adapted to the ADHD suffering user's needs & likes.
  - Short but yet complete titles & descriptions.

  OUTPUT FORMAT (AVOID USING EXTRA CHARACTERS OTHERS THAN A READY TO PARSE OBJECT): {
  unit:string,
  topic:string,
  title:string,
  tags:string[], (1-4 tags)
  expected_learning:string,
  lesson_sections (3-5 lessons, interspersed types, type probabilities 40% theory, 40% practice, 20% creativity): {
  type:'theory'|'practice'|'creativity',
  title:string,
  exp:number, (10-100 based on difficulty level, you can include even and odd numbers)
  }[]
  }`;

  if (type == "diagnostic") {
    model_instructions = `Mentor for a student suffering from ADHD, think of the best diagnosis suited type of lesson for ${subject} for this student profile:
    student name:${profile.name}
    grade level (high-school):${profile.grade_level}
    confidence status: ${profile.confidence_status.filter(
      (status) => status.area == subject
    )}
    for output, follow:
    -Output must be valid JSON.
    - NEVER MENTION ADHD.
    - For diagnostics, just set the title to "$subject diagnostic".
    -Text shouldn't be too large.
    -Output must be a single JSON object.
    -Output must not include markdown, <s> tags, code fences, comments, or any other text.
    -The first character must be { and the last character must be }.
    `;

    model_prompt = `Generate a lesson with these specifications:
  - Adapted to the ADHD suffering user's needs & likes.
  - Short but yet complete titles & descriptions.
  OUTPUT FORMAT (AVOID USING EXTRA CHARACTERS OTHERS THAN A READY TO PARSE OBJECT):
  {
  title:string,
  expected_learning:string, (complete after 'You will', but don't add 'You will')
  lesson_sections (3-5 lessons): {
  type:'theory'|'practice'|'creativity',
  title:string,
  exp:number, (10-100 based on difficulty level)
  }[]
  }`;
  }
  const lesson_data_raw = await PromptModel(model_instructions, model_prompt);

  const lesson_data = JSON.parse(
    lesson_data_raw.content?.substring(
      lesson_data_raw.content?.indexOf("{"),
      lesson_data_raw.content?.lastIndexOf("}") + 1
    ) || ""
  );
  const lessonID = generateId("lesson");
  const lesson: Lesson = {
    user_id: profile.user_id,
    subject: subject,
    approximate_duration: 0,
    unit: lesson_data["unit"] || null,
    topic: lesson_data["topic"] || null,
    title: lesson_data["title"],
    grade: profile.grade_level,
    tags: lesson_data["tags"] || [],
    category: "diagnostic",
    percentage_completed: 0,
    status: "not started",
    expected_learning: lesson_data["expected_learning"].toLowerCase(),
    lesson_sections: lesson_data["lesson_sections"].map(
      (section: LessonSection) => {
        return {
          type: section["type"],
          title: section["title"],
          exp: section["exp"],
          section_id: generateId("section"),
          lesson_id: lessonID,
          status: "not started",
        };
      }
    ),
    lesson_id: lessonID,
  };
  return lesson;
}

function generateId(prefix: string, characters: number = 10) {
  let id = `${prefix}-`;
  const availableChars = "abcdefghijklmnopqrstuvwxyz1234567890";
  for (let i = 0; i < characters; i++) {
    const selectedCharacter =
      availableChars[Math.floor(Math.random() * (availableChars.length - 1))];
    const finalChar =
      Math.floor(Math.random() * 10) > 5
        ? selectedCharacter.toUpperCase()
        : selectedCharacter;
    id += finalChar;
  }
  return id;
}
