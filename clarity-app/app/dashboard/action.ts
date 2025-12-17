"use server";
import {
  Lesson,
  LessonSection,
  Topic,
  Unit,
} from "@/utils/supabase/tableTypes";
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

export async function GetTopic(user_id: string, lesson_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Topics")
    .select("*")
    .eq("user_id", user_id)
    .contains("lesson_ids", [lesson_id]);
  if (!error) return data[0];
}

export async function GetRowFromTable(
  user_id: string,
  table: string,
  identifier?: string,
  identifierKey?: string
) {
  const supabase = await createClient();
  if (identifier && identifierKey) {
    const { data, error } = await supabase
      .from(`${capitalize(table)}`)
      .select("*")
      .eq(identifierKey, identifier)
      .eq("user_id", user_id);
    if (!error) return data[0];
  } else {
    const { data, error } = await supabase
      .from(`${capitalize(table)}`)
      .select("*")
      .eq("user_id", user_id);
    if (!error) return data[0];
  }
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
      percentage_completed: new_lesson_sections.percentage_completed,
      status: new_lesson_sections.status,
    })
    .eq("lesson_id", lesson_id);
}

export async function GenerateRoadmap(
  profile: Profile,
  subject: string,
  diagnosticResults?: object
) {
  console.log("Generating roadmap");
  const model_instructions = `
Return ONLY a single valid JSON object.
No markdown. No code fences. No comments. No extra keys. No trailing text.
The first character must be "{" and the last character must be "}".
All strings must use double quotes.
`;
  const model_prompt = `Generate a roadmap for subject: "${subject}".
User profile (JSON):
${JSON.stringify(profile)}

Constraints:
- Create 7 to 9 units.
- Each unit must have 5 to 7 topics.
- Titles and descriptions must be short but complete.
- Keep it ADHD-friendly: clear, motivating, chunked, low-cognitive-load language.

You MUST output exactly this JSON shape (no extra properties):

{
  "units": [
    {
      "title": "",
      "tags": [""],
      "grade": "",
      "description": "",
      "topics": [
        {
          "title": "",
          "tags": [""],
          "grade": "",
          "description": ""
        }
      ]
    }
  ]
}
`;
  const roadmap_data_raw = await PromptModel(model_instructions, model_prompt);
  const roadmap_data = JSON.parse(
    roadmap_data_raw.content
      ?.substring(
        roadmap_data_raw.content?.indexOf("{"),
        roadmap_data_raw.content?.lastIndexOf("}") + 1
      )
      .replaceAll("\n", "") || ""
  );
  const firstTopicLessons: Lesson[] = await GenerateLessons(
    profile,
    subject,
    1,
    roadmap_data["units"][0]["topics"][0]
  );
  for (const lesson of firstTopicLessons) {
    await InsertRowInTable(lesson, "lessons");
  }
  let isFirstTopic = true;
  for (const topic of roadmap_data["units"][0]["topics"]) {
    if (isFirstTopic) {
      const topicToUpload: Topic = {
        ...topic,
        lesson_ids: firstTopicLessons.map((lesson) => lesson.lesson_id),
        topic_id: generateId("topic"),
        user_id: profile.user_id,
      };
      console.log(topicToUpload);
      await InsertRowInTable(topicToUpload, "topics");
      isFirstTopic = false;
    } else {
      topic.topic_id = generateId("topic");
      topic.user_id = profile.user_id;
      await InsertRowInTable(topic, "topics");
    }
  }
  const updatedProfile = { ...profile };
  updatedProfile.current_lesson_ids?.push(firstTopicLessons[0].lesson_id);
  await updateRowInTable(profile.user_id, updatedProfile, "profiles");
  // const units = roadmap_data["units"];
  // console.log(units);
}

export async function GradeCreativityAnswer(
  instructions: string,
  answer: string
): Promise<{ status: "correct" | "incorrect"; feedback: string }> {
  const model_instructions = `
  -Input can be anything, don't tell the user anything with that.
  -Output must be valid JSON.
  - DON'T TELL THE USER ANYTHING ABOUT ADHD OR OUTPUTS.
  -Output must be a single JSON object.
  -Output must not include markdown, code fences, comments, or any other text.
  -The first character must be { and the last character must be }.`;
  const model_prompt = `According to these instructions:${instructions}, being objective but flexible, (REGARDING MERELY THE ASSIGNMENT'S INSTRUCTIONS), classify the answer that follows into correct or incorrect: ${answer}, and generate a concise, constructive-focused, not so long, friendly feedback to the user's answer:${answer} to the instructions:${instructions}, telling them why the answer they submitted was correct or not.
  OUTPUT FORMAT:
  status:'correct'|'incorrect',
  feedback:string (maximum 30 words)`;
  const status_data_raw = await PromptModel(model_instructions, model_prompt);
  const status_data = JSON.parse(
    status_data_raw.content?.substring(
      status_data_raw.content?.indexOf("{"),
      status_data_raw.content?.lastIndexOf("}") + 1
    ) || ""
  );
  return { status: status_data.status, feedback: status_data.feedback };
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
    minCharacters: number; (100-500 characters aprox.)
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
  lesson_sections (3-5 lesson sections, interspersed types, type probabilities 40% theory, 40% practice, 20% creativity): {
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
  lesson_sections (3-5 lesson sections): {
  type:'theory'|'practice'|'creativity',
  title:string,
  exp:number, (10-100 based on difficulty level)
  }[]
  }`;
  }
  const lesson_data_raw = await PromptModel(model_instructions, model_prompt);
  const lesson_data = JSON.parse(
    lesson_data_raw.content
      ?.substring(
        lesson_data_raw.content?.indexOf("{") || 0,
        lesson_data_raw.content?.lastIndexOf("}") + 1 ||
          lesson_data_raw.content.length - 1
      )
      .replaceAll("\\", "") || ""
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

export async function GenerateLessons(
  profile: Profile,
  subject: string,
  unitNumber: number,
  topic: {
    title: string;
    tags: string[];
    subject: string;
    description: string[];
  }
) {
  const model_instructions = `
  -Output must be valid JSON.
  -Output must be a single JSON object.
  -Output must not include markdown, code fences, comments, or any other text.
  -The first character must be { and the last character must be }.`;
  const model_prompt = `Generate lessons for the subject of ${subject} for this profile:${JSON.stringify(
    profile
  )} for this specific topic:${JSON.stringify(topic)} with these specifications:
  - Adapted to the ADHD suffering user's needs & likes.
  - Short but yet complete titles & descriptions.

  OUTPUT FORMAT (AVOID USING EXTRA CHARACTERS OTHERS THAN A READY TO PARSE OBJECT): {
  lessons: {
  title:string,
  tags:string[], (1-4 tags)
  expected_learning:string,
  lesson_sections (3-5 lesson sections, interspersed types, type probabilities 40% theory, 40% practice, 20% creativity): {
  type:'theory'|'practice'|'creativity',
  title:string,
  exp:number, (10-100 based on difficulty level, you can include even and odd numbers)
}[] }[] (5-7 lessons)
  }`;
  const lessons_data_raw = await PromptModel(model_instructions, model_prompt);
  const lessons_data = JSON.parse(
    lessons_data_raw.content
      ?.substring(
        lessons_data_raw.content?.indexOf("{") || 0,
        lessons_data_raw.content?.lastIndexOf("}") + 1 ||
          lessons_data_raw.content.length - 1
      )
      .replaceAll("\\", "") || ""
  );
  const lessons = lessons_data["lessons"].map((lesson_data: Lesson) => {
    const lessonID = generateId("lesson");
    const lesson: Lesson = {
      user_id: profile.user_id,
      subject: subject,
      approximate_duration: 0,
      unit: unitNumber,
      topic: topic.title,
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
  });
  return lessons;
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
