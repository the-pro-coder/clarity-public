"use server";
import {
  Lesson,
  LessonSection,
  Roadmap,
  Topic,
  Unit,
} from "@/utils/supabase/tableTypes";
import capitalize from "@/components/custom/util/Capitalize";
import PromptModel from "@/components/custom/util/LLMIntegration";
import { createClient } from "@/utils/supabase/server";
import { User, Preferences, Profile } from "@/utils/supabase/tableTypes";
import { redirect } from "next/navigation";
async function alreadyInsertedRow(
  table: string,
  user_id: string,
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
  data_to_insert: Profile | User | Preferences,
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
      preferencesDataToInsert,
    );
    if (preferencesResponse?.error) {
      throw preferencesResponse.error.message;
    }
    const alreadyInsertedProfile = await alreadyInsertedRow(
      "profiles",
      user?.id || "",
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

export async function GetUnit(
  user_id: string,
  subject: string,
  number: number,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Units")
    .select("*")
    .eq("user_id", user_id)
    .eq("subject", subject)
    .eq("number", number);
  if (!error) return data[0];
}

export async function GetRowFromTable(
  user_id: string,
  table: string,
  identifier?: string,
  identifierKey?: string,
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

export async function GetRoadmap(user_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Roadmaps")
    .select("*")
    .eq("user_id", user_id);
  if (!error) return data;
}

export async function InsertRowInTable(dataToInsert: object, table: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .insert(dataToInsert);
  if (!error) return data;
}
export async function updateRowInTable(
  user_id: string,
  dataToInsert: object,
  table: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(`${capitalize(table)}`)
    .update(dataToInsert)
    .eq("user_id", user_id);
  if (!error) return data;
}

export async function updateTopicRowInTable(
  user_id: string,
  dataToInsert: object,
  topic_id: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Topics")
    .update(dataToInsert)
    .eq("user_id", user_id)
    .eq("topic_id", topic_id);
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
  new_lesson_sections: Lesson,
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

export async function GenerateOpportunityAreas(
  profile: Profile,
  lessonResults: { section: string; status: "correct" | "incorrect" }[],
  subject: string,
) {
  const model_instructions = `
Return ONLY a single valid JSON object.
No markdown. No code fences. No comments. No extra keys. No trailing text.
The first character must be "{" and the last character must be "}".
All strings must use double quotes.
`;

  const model_prompt = `
Task:
Generate all the opportunity areas for the subject of ${subject} based on the wrong answers in the input lesson results list.
Do NOT add, remove, reorder, or rename sections.
Each item must follow the correct shape.
AVOID COMPLETELY adding opportunity areas similar or equal in topic to those existing already in the user profile. 
Generate one opportunity area for each wrong answer.
Titles and descriptions should be short and clear for the user, but complete at the same time.

Input lesson results (JSON):
${JSON.stringify(lessonResults)}

User profile (JSON):
${JSON.stringify(profile)}

Output schema (MUST match exactly; no extra properties):
{
  opportunity_areas: [ {
    subject: string,
    area: string,
    suggestedExercisesTopic: string,
    improvementRequirements: string,
    }
  ]
}

Hard rules:
- length of opportunity_areas MUST equal ${
    lessonResults.filter(({ status }) => {
      return status == "incorrect";
    }).length
  }.
- for each opportunity area inside opportunity_areas, the improvementRequirements field should contain the things needed to improve according to the other fields.

Silent self-check before output:
- Valid JSON? Single object?
- All Hard rules followed correctly?
- Length matches input and types match by index?
- Each item matches its type schema and constraints?
Fix silently and output ONLY the final JSON object.
`;
  const opportunity_areas_data_raw = await PromptModel(
    model_instructions,
    model_prompt,
  );
  const opportunity_areas_data = JSON.parse(
    opportunity_areas_data_raw.content
      ?.substring(
        opportunity_areas_data_raw.content?.indexOf("{"),
        opportunity_areas_data_raw.content?.lastIndexOf("}") + 1,
      )
      .replaceAll("\n", "") || "",
  );
  return opportunity_areas_data;
}

export async function GenerateRoadmap(
  profile: Profile,
  subject: string,
  diagnosticResults?: object,
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
${
  diagnosticResults != null
    ? `
User results in diagnostic exam (JSON):
${diagnosticResults}
  `
    : ""
}

Constraints:
- Create 7 to 9 units.
- Take into consideration the user's understanding level according to their profile and their diagnostic exam so they can catch up.
- Each unit must have 1-3 one/two worded tags related with the topics it has.
- Each unit must have 5 to 7 topics.
- Each topic must have 1-3 one/two worded tags related with the topic.
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
  const roadmap_data_raw = await PromptModel(
    model_instructions,
    model_prompt,
    "arcee-ai/trinity-mini:free",
  );
  // console.log(roadmap_data_raw);
  const roadmap_data = JSON.parse(
    roadmap_data_raw.content
      ?.substring(
        roadmap_data_raw.content?.indexOf("{"),
        roadmap_data_raw.content?.lastIndexOf("}") + 1,
      )
      .replaceAll("\n", "") || "",
  );
  const firstTopicLessons: Lesson[] = await GenerateLessons(
    profile,
    subject,
    1,
    roadmap_data["units"][0]["topics"][0],
  );
  for (const lesson of firstTopicLessons) {
    await InsertRowInTable(lesson, "lessons");
  }
  let isFirstTopic = true;

  const units = roadmap_data["units"];
  const unitTopicIds = [];
  for (let i = 0; i < units.length; i++) {
    const topicIds = [];
    for (let k = 0; k < units[i]["topics"].length; k++) {
      const topicId = generateId("topic");
      topicIds.push(topicId);
      const topic = units[i]["topics"][k];
      if (isFirstTopic) {
        const topicToUpload: Topic = {
          ...topic,
          lesson_ids: firstTopicLessons.map((lesson) => lesson.lesson_id),
          topic_id: topicId,
          subject: subject,
          user_id: profile.user_id,
        };
        // console.log(topicToUpload);
        await InsertRowInTable(topicToUpload, "topics");
        isFirstTopic = false;
      } else {
        topic.topic_id = topicId;
        topic.user_id = profile.user_id;
        topic.subject = subject;
        await InsertRowInTable(topic, "topics");
      }
    }
    unitTopicIds.push(topicIds);
  }
  const updatedProfile = { ...profile };
  updatedProfile.current_lesson_ids?.push(firstTopicLessons[0].lesson_id);
  await updateRowInTable(profile.user_id, updatedProfile, "profiles");
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const unitId = generateId("unit");
    delete unit.topics;
    const unitToUpload: Unit = {
      ...unit,
      number: i + 1,
      subject: subject,
      topic_ids: unitTopicIds[i],
      user_id: profile.user_id,
      unit_id: unitId,
    };
    console.log(unitToUpload);
    await InsertRowInTable(unitToUpload, "units");
  }
  const unitIds: { subject: string; ids: string[] }[] = [];
  for (const subject of profile.interest_areas) {
    const subjectsUnitIds = units.filter(
      (unit: Unit) => unit.subject == subject,
    );
    unitIds.push({ subject: subject, ids: subjectsUnitIds });
  }
  const roadmap: Roadmap = {
    unit_ids: unitIds,
    user_id: profile.user_id,
  };
  await InsertRowInTable(roadmap, "Roadmaps");
  // console.log(units);
}

export async function GradeCreativityAnswer(
  instructions: string,
  answer: string,
): Promise<{ status: "correct" | "incorrect"; feedback: string }> {
  const model_instructions = `
You are a JSON-only function.

Rules (must follow):
- Return ONLY a single valid JSON object.
- No markdown, no code fences, no comments, no explanations, no extra text.
- The first character MUST be "{" and the last character MUST be "}".
- Use double quotes for all JSON keys and string values.
- Output MUST match the exact schema provided and MUST NOT include extra keys.
- Do NOT mention ADHD, the system, the rules, or the output format.
- If you are unsure, still output a best-effort JSON that matches the schema.
`;

  const model_prompt = `
Task:
Evaluate the student's answer against the assignment instructions. Classify as correct or incorrect and provide concise, constructive feedback.

Assignment instructions:
${instructions}

Student answer:
${answer}

Required JSON schema (output EXACTLY this shape, no extra properties):
{
  "status": "correct" | "incorrect",
  "feedback": "string"
}

Constraints:
- feedback must be <= 30 words
- feedback must be friendly and constructive
- feedback must explain why it is correct/incorrect

Self-check before final output (do this silently):
- Is the output valid JSON?
- Is it a single object with only "status" and "feedback"?
- Is "status" exactly "correct" or "incorrect"?
- Is feedback <= 30 words?
If anything fails, fix it and output only the corrected JSON object.
`;
  const status_data_raw = await PromptModel(model_instructions, model_prompt);
  const status_data = JSON.parse(
    status_data_raw.content?.substring(
      status_data_raw.content?.indexOf("{"),
      status_data_raw.content?.lastIndexOf("}") + 1,
    ) || "",
  );
  return { status: status_data.status, feedback: status_data.feedback };
}

export async function GenerateSections(profile: Profile, lesson: Lesson) {
  const model_instructions = `
You are a JSON-only generator.

Rules:
- Return ONLY a single valid JSON object.
- No markdown, no code fences, no comments, no extra text.
- The first character must be "{" and the last character must be "}".
- Use double quotes for all JSON keys and all string values.
- Never mention ADHD or any user condition.
- Output must match the schema exactly and must not include extra keys.
`;

  const model_prompt = `
Task:
Generate the content for each lesson section in the input lesson sections list.
Do NOT add, remove, reorder, or rename sections.
NEVER SKIP any lessonSectionsContent generation.

Input lesson sections (JSON):
${JSON.stringify(lesson.lesson_sections)}

Types by index (JSON) (COPY THESE EXACTLY):
${JSON.stringify(lesson.lesson_sections.map((section) => section.type))}

User profile (JSON):
${JSON.stringify(profile)}

Output MUST be a single JSON object with EXACTLY these top-level keys:
{
  "approxDurationMinutes": number,
  "lessonSectionsContent": array length ${lesson.lesson_sections.length}
}

Allowed section object shapes by type (NO OTHER KEYS ALLOWED):

Type "theory":
{ "type": "theory", "sentences": string[] }

Type "practice":
{
  "type": "practice",
  "question": string,
  "explanation": string,
  "answers": [ { "text": string, "correct": boolean } ]
}

Type "creativity":
{
  "type": "creativity",
  "instructions": string,
  "tips": string[],
  "minCharacters": number
}

Hard rules:
- lessonSectionsContent.length MUST equal ${lesson.lesson_sections.length}.
- For each index i: lessonSectionsContent[i].type MUST equal Types by index[i].
- Never output a type that is not exactly the one at that index.
- Never output multiple objects for a single input index.
- Each item object MUST include only the keys allowed for its type.

Per-type requirements:

theory:
- "sentences" must contain 3-6 short, clear sentences.
- Explanatory order; slow pace; define concept words involved.
- Include examples.
- Highlight content with **double asterisks** and single keywords in [brackets].

practice:
- "answers" must contain 4-6 options.
- Exactly 1 answer must have "correct": true.
- Only 1 strictly best answer.
- Question not too long; related to the closest earlier theory section.
- "explanation" concise and justifies why the correct option is correct.

creativity:
- "tips" must contain 3-6 tips.
- Provide all needed materials for the task in "instructions".
- Tips must not reveal the answer; only helpful guidance.
- Task should be fun, short, challenging; user responds in text only.
- "minCharacters" must be between 20 and 500.

Time requirement:
- approxDurationMinutes must be realistic total estimate.
- Guidance: theory ~0.5 min each, practice 1-2 min each, creativity 2-4 min each.
- Do not output extreme times.

Silent self-check before output:
- Valid JSON? Single object?
- Only top-level keys: "approxDurationMinutes" and "lessonSectionsContent"?
- Length matches input and types match by index?
- Each item matches its type schema and constraints?
Fix silently and output ONLY the final JSON object.
`;

  const sections_data_raw = await PromptModel(model_instructions, model_prompt);
  const sections_content = JSON.parse(
    sections_data_raw.content?.substring(
      sections_data_raw.content?.indexOf("{"),
      sections_data_raw.content?.lastIndexOf("}") + 1,
    ) || "",
  );
  lesson.lesson_sections = lesson.lesson_sections.map((lesson_section, i) => {
    const section = {
      ...lesson_section,
      content: sections_content["lessonSectionsContent"][i],
    };
    return section;
  });
  lesson.approximate_duration = sections_content["approxDurationMinutes"];
  await UpdateLessonSections(lesson.lesson_id, lesson);
  return lesson;
}

export async function GenerateCustomLesson(
  profile: Profile,
  opportunity_area: {
    subject: string;
    area: string;
    suggestedExercisesTopic: string;
    improvementRequirements: string;
  },
) {
  const model_instructions = `
You are a JSON-only generator.

Rules:
- Return ONLY a single valid JSON object.
- No markdown, code fences, comments, or extra text.
- The first character must be "{" and the last character must be "}".
- Use double quotes for all keys and string values.
- Output must match the schema exactly and must not include extra keys.
- Do not mention any medical conditions or diagnoses.
`;

  const model_prompt = `
Task:
Generate ONE lesson for subject: "${opportunity_area.subject}", targeting to improve a student's performance in ${opportunity_area.area}.

The suggested exercises topic is ${opportunity_area.suggestedExercisesTopic}
Target to help the student improve the following: ${opportunity_area.improvementRequirements}

Student profile (JSON):
${JSON.stringify(profile)}

Lesson requirements:
- Short but complete titles and descriptions.
- Create 3 to 5 lesson sections.
- Choose section types deliberately for completeness (intro → practice → reinforcement).
- Distribution is a soft target, but MUST satisfy these hard constraints:
  - At least 1 "practice" section.
  - At least 1 "creativity" section. (required)
  - "theory" is optional.
- If lesson_sections length is 3: include exactly 1 creativity + at least 1 practice.
- If length is 4-5: include 1-2 creativity and 1-3 practice (rest theory if needed).
- Keep difficulty reasonable; steps should be clear and doable.
- Prefer 4 or 5 lesson sections when the content reasonably allows it.
- Use only 3 sections if the lesson would become repetitive or bloated with more.
- Across the generated lessons, avoid always using the same section count.

Output schema (EXACT, no extra properties):
{
  "unit": "",
  "topic": "",
  "title": "",
  "tags": [""],
  "expected_learning": "",
  "lesson_sections": [
    { "type": "theory", "title": "", "exp": 10 }
  ]
}

Constraints:
- tags: 1 to 4 items.
- lesson_sections: 3 to 5 items.
- type: one of "theory", "practice", "creativity".
- exp: integer 10 to 100 (reflect difficulty).
- Section titles: 2-7 words, specific and action-oriented.

Silent self-check before output:
- Valid JSON? One object only?
- Only allowed keys?
- tags count 1-4?
- lesson_sections count 3-5?
- Contains at least 1 practice AND at least 1 creativity?
- type values valid and exp integers valid?
Fix silently and output only the corrected JSON.
`;
  const lesson_data_raw = await PromptModel(model_instructions, model_prompt);
  const lesson_data = JSON.parse(
    lesson_data_raw.content
      ?.substring(
        lesson_data_raw.content?.indexOf("{") || 0,
        lesson_data_raw.content?.lastIndexOf("}") + 1 ||
          lesson_data_raw.content.length - 1,
      )
      .replaceAll("\\", "") || "",
  );
  const lessonID = generateId("lesson");
  const lesson: Lesson = {
    user_id: profile.user_id,
    subject: opportunity_area.subject,
    approximate_duration: 0,
    unit: 0,
    topic: "",
    title: lesson_data["title"],
    grade: profile.grade_level,
    tags: lesson_data["tags"] || [],
    category: "improvement",
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
      },
    ),
    lesson_id: lessonID,
  };
  return lesson;
}

export async function GenerateLesson(
  profile: Profile,
  subject: string,
  type: "diagnostic" | "default",
) {
  let model_instructions = `
You are a JSON-only generator.

Rules:
- Return ONLY a single valid JSON object.
- No markdown, code fences, comments, or extra text.
- The first character must be "{" and the last character must be "}".
- Use double quotes for all keys and string values.
- Output must match the schema exactly and must not include extra keys.
- Do not mention any medical conditions or diagnoses.
`;

  let model_prompt = `
Task:
Generate ONE lesson for subject: "${subject}".

Student profile (JSON):
${JSON.stringify(profile)}

Lesson requirements:
- Short but complete titles and descriptions.
- Create 3 to 5 lesson sections.
- Choose section types deliberately for completeness (intro → practice → reinforcement).
- Distribution is a soft target, but MUST satisfy these hard constraints:
  - At least 1 "practice" section.
  - At least 1 "creativity" section. (required)
  - "theory" is optional.
- If lesson_sections length is 3: include exactly 1 creativity + at least 1 practice.
- If length is 4-5: include 1-2 creativity and 1-3 practice (rest theory if needed).
- Keep difficulty reasonable; steps should be clear and doable.
- Prefer 4 or 5 lesson sections when the content reasonably allows it.
- Use only 3 sections if the lesson would become repetitive or bloated with more.
- Across the generated lessons, avoid always using the same section count.

Output schema (EXACT, no extra properties):
{
  "unit": "",
  "topic": "",
  "title": "",
  "tags": [""],
  "expected_learning": "",
  "lesson_sections": [
    { "type": "theory", "title": "", "exp": 10 }
  ]
}

Constraints:
- tags: 1 to 4 items.
- lesson_sections: 3 to 5 items.
- type: one of "theory", "practice", "creativity".
- exp: integer 10 to 100 (reflect difficulty).
- Section titles: 2-7 words, specific and action-oriented.

Silent self-check before output:
- Valid JSON? One object only?
- Only allowed keys?
- tags count 1-4?
- lesson_sections count 3-5?
- Contains at least 1 practice AND at least 1 creativity?
- type values valid and exp integers valid?
Fix silently and output only the corrected JSON.
`;

  if (type === "diagnostic") {
    model_instructions = `
You are a JSON-only generator.

Rules:
- Return ONLY a single valid JSON object.
- No markdown, code fences, comments, or extra text.
- The first character must be "{" and the last character must be "}".
- Use double quotes for all keys and string values.
- Output must match the schema exactly and must not include extra keys.
- Do not mention any medical conditions or diagnoses.
`;
    model_prompt = `
Task:
Generate ONE diagnostic lesson for subject: "${subject}".
Goal: collect diagnostic signal (confidence, misconceptions, pacing) while staying easy and low-pressure.

Student profile (JSON):
${JSON.stringify(profile)}

Confidence status related to this subject (JSON):
${JSON.stringify(
  profile.confidence_status?.filter((s) => s.area === subject) ?? [],
)}

Output schema (EXACT, no extra properties):
{
  "title": "${subject} Diagnostic",
  "expected_learning": "",
  "lesson_sections": [
    { "type": "practice", "title": "", "exp": 10 }
  ]
}

Diagnostic hard constraints:
- title MUST be exactly "${subject} Diagnostic".
- expected_learning must complete after "You will" BUT do not include the words "You will".
- lesson_sections MUST be 8 to 10 items.
- Allowed section types: ONLY "practice" and "creativity". (theory is forbidden)
- Include BOTH types:
  - practice count: 5-7
  - creativity count: 2-4
- Keep difficulty low: exp should usually be 10-35.
- Section titles should hint at the diagnostic signal:
  - practice titles should target a specific micro-skill or common misconception.
  - creativity titles should ask for explanation/strategy in the student's own words.

Silent self-check before output:
- Valid JSON? One object only?
- title exactly "${subject} Diagnostic"?
- expected_learning does NOT include "You will"?
- lesson_sections count 8-10?
- Contains only "practice" and "creativity" types?
- practice count 5-7 and creativity count 2-4?
- exp integers 10-100 (prefer 10-35)?
Fix silently and output only the JSON object.
`;
  }

  const lesson_data_raw = await PromptModel(model_instructions, model_prompt);
  const lesson_data = JSON.parse(
    lesson_data_raw.content
      ?.substring(
        lesson_data_raw.content?.indexOf("{") || 0,
        lesson_data_raw.content?.lastIndexOf("}") + 1 ||
          lesson_data_raw.content.length - 1,
      )
      .replaceAll("\\", "") || "",
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
    category: type,
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
      },
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
  },
) {
  const model_instructions = `
You are a JSON-only generator.

Rules:
- Return ONLY a single valid JSON object.
- No markdown, code fences, comments, or extra text.
- The first character must be "{" and the last character must be "}".
- Use double quotes for all keys and string values.
- Output must match the schema exactly and must not include extra keys.
- Do not mention any medical conditions or diagnoses.
`;

  const model_prompt = `
Task:
Generate 5 to 7 lessons for subject: "${subject}" focused on the given topic.

Student profile (JSON):
${JSON.stringify(profile)}

Topic (JSON):
${JSON.stringify(topic)}

Lesson requirements:
- Titles and expected_learning must be short but complete.
- Each lesson must be meaningfully different (different sub-skill, angle, or progression step).
- Each lesson must have 3 to 5 lesson sections.
- Section types must be chosen deliberately for completeness (intro → practice → reinforcement).
- Distribution is a soft target, but MUST satisfy these hard constraints PER LESSON:
  - At least 1 "practice" section.
  - At least 1 "creativity" section. (required)
  - At least 1 "theory" section.
- If a lesson has 3 sections: include exactly 1 creativity + at least 1 practice.
- If a lesson has 4-5 sections: include 1 creativity, 1-2 theory, and 1-2 practice.
- Prefer 4 or 5 lesson sections when the content reasonably allows it.
- Use only 3 sections if the lesson would become repetitive or bloated with more.
- Across the generated lessons, avoid always using the same section count.

Across the full set of lessons:
- At least 2 lessons must have 4 sections.
- At least 1 lesson must have 5 sections.
- No more than 2 lessons may have only 3 sections.

Output schema (EXACT, no extra properties):
{
  "lessons": [
    {
      "title": "",
      "tags": [""],
      "expected_learning": "",
      "lesson_sections": [
        { "type": "theory", "title": "", "exp": 10 }
      ]
    }
  ]
}

Constraints:
- lessons: 5 to 7 items.
- tags: 1 to 4 items.
- lesson_sections: 3 to 5 items.
- type must be one of: "theory", "practice", "creativity".
- exp must be an integer 10 to 100.

Quality rules:
- Section titles: 2-7 words, concrete and action-oriented.
- exp should reflect difficulty (earlier lessons lower, later lessons higher).
- Avoid repeating the same lesson title or identical section patterns across lessons.

Silent self-check before output:
- Valid JSON and single object?
- Only top-level key "lessons"?
- lessons length 5-7?
- For each lesson:
  - tags 1-4?
  - sections 3-5?
  - contains at least 1 practice AND at least 1 creativity?
  - types valid and exp valid integer 10-100?
- No extra keys anywhere?
Fix silently and output only the JSON object.
Section count control:
- Each lesson must have 3 to 5 sections.
- Prefer 4 or 5 sections for most lessons.
- Use 3 sections ONLY when the lesson focuses on a single narrow skill.
- Across all lessons, avoid repeating the same section count for every lesson.
- Are section counts varied across lessons (not all equal)?
`;

  const lessons_data_raw = await PromptModel(model_instructions, model_prompt);
  const lessons_data = JSON.parse(
    lessons_data_raw.content
      ?.substring(
        lessons_data_raw.content?.indexOf("{") || 0,
        lessons_data_raw.content?.lastIndexOf("}") + 1 ||
          lessons_data_raw.content.length - 1,
      )
      .replaceAll("\\", "") || "",
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
      category: "default",
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
        },
      ),
      lesson_id: lessonID,
    };
    return lesson;
  });
  return lessons;
}

export async function GenerateLessonsAndUpload(
  profile: Profile,
  subject: string,
  unitNumber: number,
  topic: {
    title: string;
    tags: string[];
    subject: string;
    description: string[];
  },
) {
  const model_instructions = `
You are a JSON-only generator.

Rules:
- Return ONLY a single valid JSON object.
- No markdown, code fences, comments, or extra text.
- The first character must be "{" and the last character must be "}".
- Use double quotes for all keys and string values.
- Output must match the schema exactly and must not include extra keys.
- Do not mention any medical conditions or diagnoses.
`;

  const model_prompt = `
Task:
Generate 5 to 7 lessons for subject: "${subject}" focused on the given topic.

Student profile (JSON):
${JSON.stringify(profile)}

Topic (JSON):
${JSON.stringify(topic)}

Lesson requirements:
- Titles and expected_learning must be short but complete.
- Each lesson must be meaningfully different (different sub-skill, angle, or progression step).
- Each lesson must have 3 to 5 lesson sections.
- Section types must be chosen deliberately for completeness (intro → practice → reinforcement).
- Distribution is a soft target, but MUST satisfy these hard constraints PER LESSON:
  - At least 1 "practice" section.
  - At least 1 "creativity" section. (required)
  - At least 1 "theory" section.
- If a lesson has 3 sections: include exactly 1 creativity + at least 1 practice.
- If a lesson has 4-5 sections: include 1 creativity, 1-2 theory, and 1-2 practice.
- Prefer 4 or 5 lesson sections when the content reasonably allows it.
- Use only 3 sections if the lesson would become repetitive or bloated with more.
- Across the generated lessons, avoid always using the same section count.

Across the full set of lessons:
- At least 2 lessons must have 4 sections.
- At least 1 lesson must have 5 sections.
- No more than 2 lessons may have only 3 sections.

Output schema (EXACT, no extra properties):
{
  "lessons": [
    {
      "title": "",
      "tags": [""],
      "expected_learning": "",
      "lesson_sections": [
        { "type": "theory", "title": "", "exp": 10 }
      ]
    }
  ]
}

Constraints:
- lessons: 5 to 7 items.
- tags: 1 to 4 items.
- lesson_sections: 3 to 5 items.
- type must be one of: "theory", "practice", "creativity".
- exp must be an integer 10 to 100.

Quality rules:
- Section titles: 2-7 words, concrete and action-oriented.
- exp should reflect difficulty (earlier lessons lower, later lessons higher).
- Avoid repeating the same lesson title or identical section patterns across lessons.

Silent self-check before output:
- Valid JSON and single object?
- Only top-level key "lessons"?
- lessons length 5-7?
- For each lesson:
  - tags 1-4?
  - sections 3-5?
  - contains at least 1 practice AND at least 1 creativity?
  - types valid and exp valid integer 10-100?
- No extra keys anywhere?
Fix silently and output only the JSON object.
Section count control:
- Each lesson must have 3 to 5 sections.
- Prefer 4 or 5 sections for most lessons.
- Use 3 sections ONLY when the lesson focuses on a single narrow skill.
- Across all lessons, avoid repeating the same section count for every lesson.
- Are section counts varied across lessons (not all equal)?
`;

  const lessons_data_raw = await PromptModel(model_instructions, model_prompt);
  const lessons_data = JSON.parse(
    lessons_data_raw.content
      ?.substring(
        lessons_data_raw.content?.indexOf("{") || 0,
        lessons_data_raw.content?.lastIndexOf("}") + 1 ||
          lessons_data_raw.content.length - 1,
      )
      .replaceAll("\\", "") || "",
  );
  const lessons = lessons_data["lessons"].map((lesson_data: Lesson) => {
    const lessonID = generateId(
      `lesson_${subject.substring(0, 3).toUpperCase()}`,
    );
    const lesson: Lesson = {
      user_id: profile.user_id,
      subject: subject,
      approximate_duration: 0,
      unit: unitNumber,
      topic: topic.title,
      title: lesson_data["title"],
      grade: profile.grade_level,
      tags: lesson_data["tags"] || [],
      category: "default",
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
        },
      ),
      lesson_id: lessonID,
    };
    return lesson;
  });
  for (const lesson of lessons) {
    await InsertRowInTable(lesson, "lessons");
  }
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
