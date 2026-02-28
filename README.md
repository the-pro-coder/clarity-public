# Clarity – AI-Powered Adaptive Learning Platform

An intelligent web application designed to make learning structured, focused, and accessible — especially for students who struggle with ADHD and benefit from chunked, visual, and adaptive instruction.

[Next.js](https://img.shields.io/badge/Next.js-15-black)

[Supabase](https://img.shields.io/badge/Supabase-Backend-green)

[OpenAI](https://img.shields.io/badge/LLM-Integrated-blue)

[Status](https://img.shields.io/badge/Status-Active_Development-orange)

## What is Clarity?

Clarity is an AI-powered adaptive learning platform designed to help students suffering from ADHD learn in a structured, low-distraction environment.

It breaks lessons into micro-sections (Theory → Practice → Creativity), tracks progress visually, and adapts content based on student performance.

The goal is to reduce cognitive overload and increase sustained focus.

## Why Clarity Exists

Traditional educational platforms often overwhelm students with:

- Long unstructured lessons
- High cognitive load
- Poor feedback loops
- Limited personalization

Clarity is designed with neurodiversity in mind — especially for students with ADHD or focus-related challenges.

The platform prioritizes:

- Micro-chunked learning
- Immediate feedback
- Visible progress tracking
- Creative reinforcement
- AI-driven adaptation

## Software Architecture

![image.png](https://i.ibb.co/PGZvd4vn/image-4.png)

![image.png](image%201.png)

### Architecture Overview

Clarity uses a modular full-stack architecture optimized for both speed and flexibility.

At runtime, the frontend can follow two paths depending on the feature:

**Path A — Direct Supabase calls (no AI involved)**

- Used for: authentication, CRUD (profiles, progress, settings), dashboard reads, saved content
- Flow: **Frontend → Supabase → Frontend**

**Path B — AI-enhanced flow (OpenRouter + persistence)**

- Used for: lesson generation, explanation refinement, answer feedback, creative prompts
- Flow: **Frontend → OpenRouter (AI) → Supabase (store/update) → Frontend**
- AI output is persisted to Supabase so the app can track progress, reuse results, and power analytics.

## Target Audience

Clarity is built for:

- High school students (mainly with an ADHD diagnosis)
- Neurodivergent learners
- Self-paced learners
- Educators seeking adaptive tools

### Value Proposition

Clarity transforms passive content consumption into active learning by combining:

- Structured progression
- AI-generated explanations
- Practice reinforcement
- Creative application exercises

## AI Models & Intelligence Layer

Clarity integrates commercial large language models (LLMs) via OpenRouter’s API for:

- Lesson generation
- Explanation simplification
- Adaptive feedback
- Creative writing evaluation

Model Strategy:

- Primary Model: TBD
- Fallback Model: TBD

The system dynamically optimizes token usage to balance performance and cost.

## Project Structure

clarity-app/
│
├── app/ # Next.js App Router layer
│ ├── api/ # API route handlers
│ ├── authenticate/ # Auth-related pages
│ ├── dashboard/ # Dashboard routes
│ ├── lessons/ # Lesson routes
│ ├── favicon.ico
│ ├── globals.css # Global styling
│ ├── layout.tsx # Root layout wrapper
│ └── page.tsx # Landing page entry
│
├── components/
│ ├── custom/ # Feature-based components
│ │ ├── auth/ # Authentication UI modules
│ │ ├── dashboard/ # Dashboard widgets & sections
│ │ ├── landing page/ # Landing page components
│ │ ├── lessons/ # Lesson engine components
│ │ ├── prefabs/ # Reusable composite blocks
│ │ └── util/ # Helper components
│ │
│ └── ui/ # shadcn/ui design system components
│
├── lib/
│ └── utils.ts # Shared utility logic
│
├── public/ # Static assets
│ ├── app logos/
│ ├── auth/
│ ├── dashboard/
│ └── landing page/
│
├── utils/
│ └── supabase/ # Supabase integration layer
│ ├── client.ts # Browser client
│ ├── server.ts # Server client
│ ├── middleware.ts # Session middleware
│ └── tableTypes.ts # Database type definitions
│
├── globals.css
├── layout.tsx
└── configuration files...

The codebase is structured for scalability, separating:

- Presentation
- Logic
- AI integration
- State management
- Database communication

## Code Area – Meaningful Snippets

### Code Highlights (Core Logic)

Clarity’s core logic revolves around three pillars:

1. **Type-safe data contracts** (Supabase tables → TypeScript types)
2. **Auth callback handling** (OAuth code exchange → session)
3. **Server Actions powering personalization** (Supabase reads/writes + OpenRouter AI generation)

### 1) Type-safe Database Contracts (`utils/supabase/tableTypes.ts`)

Clarity enforces a consistent schema across the app by using TypeScript types that mirror Supabase tables. This prevents “mystery objects” and makes dashboard + lessons predictable.

```tsx
export type Profile = {
  user_id: string;
  name: string;
  last_name: string;
  public_username: string;
  dedication_time: string;
  interest_areas: string[];
  current_lesson_ids: string[] | null;
  confidence_status: { area: string; status: string }[];
  grade_level: string;
  opportunity_areas: {
    subject: string;
    area: string;
    completed: boolean;
    suggestedExercisesTopic: string;
    improvementRequirements: string;
    lesson_id: string;
  }[];
};

export type LessonSection = {
  type: "practice" | "theory" | "creativity";
  title: string;
  exp: number;
  section_id: string;
  lesson_id: string;
  status?: "completed" | "not started" | "incorrect";
};

export type Lesson = {
  lesson_id: string;
  title: string;
  subject: string;
  topic: string;
  unit: number;
  approximate_duration: number;
  grade: string;
  category:
    | "theory & practice"
    | "default"
    | "analysis"
    | "hands-on practice"
    | "diagnostic"
    | "improvement";
  tags: string[];
  status: "not started" | "completed" | "in progress";
  percentage_completed: number;
  expected_learning: string;
  user_id: string;
  lesson_sections: LessonSection[];
};
```

**Why this matters:** the AI outputs and the UI both target the _same strict contracts_, so you get fewer runtime surprises and cleaner evolution of the product.

### OAuth Callback Route (`app/api/v1/auth/route.ts`)

Clarity uses a clean callback handler: it exchanges the OAuth code for a session and redirects the user safely.

```tsx
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/authenticate";

  if (!code) {
    return NextResponse.redirect(`${url.origin}/authenticate?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${url.origin}/authenticate?error=exchange_failed`,
    );
  }

  return NextResponse.redirect(`${url.origin}${next}`);
}
```

**Why this matters:** it ensures authentication is handled server-side with proper session creation before entering the dashboard.

### Server Actions: onboarding + Supabase bootstrapping (`dashboard/action.ts`)

When a user signs in, Clarity ensures the minimum required records exist (User, Preferences, Profile).

If the Profile doesn’t exist, it routes them into onboarding.

```tsx
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User, Preferences, Profile } from "@/utils/supabase/tableTypes";

async function alreadyInsertedRow(
  table: string,
  user_id: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select("user_id")
    .eq("user_id", user_id)
    .maybeSingle();

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
    return await supabase.from(table).insert(data_to_insert);
  }
}

export async function Setup(user: { id: string; email: string }) {
  if (!user) return;

  await InsertRow(user.id, "Users", { user_id: user.id, email: user.email });
  await InsertRow(user.id, "Preferences", { user_id: user.id });

  const hasProfile = await alreadyInsertedRow("Profiles", user.id);
  if (!hasProfile) redirect("/dashboard/get-started");
}
```

**Why this matters:** this is a robust onboarding gate. You don’t rely on the front-end to “maybe create data later.”

### AI-Powered Personalization (OpenRouter → JSON → Supabase)

When an AI feature is triggered, Clarity calls OpenRouter and

**forces JSON-only output with strict schema rules**.

The resulting content is parsed, attached to the lesson structure, and persisted to Supabase.

```tsx
export async function GenerateSections(profile: Profile, lesson: Lesson) {
  const model_instructions = `
Return ONLY a single valid JSON object.
No markdown. No extra keys. No trailing text.
`;

  const model_prompt = `
Generate content for each lesson section.
Do NOT add, remove, reorder, or rename sections.

Input lesson sections:
${JSON.stringify(lesson.lesson_sections)}

User profile:
${JSON.stringify(profile)}

Output shape:
{
  "approxDurationMinutes": number,
  "lessonSectionsContent": [...]
}
`;

  const raw = await PromptModel(model_instructions, model_prompt);

  const parsed = JSON.parse(
    raw.content?.substring(
      raw.content.indexOf("{"),
      raw.content.lastIndexOf("}") + 1,
    ) || "",
  );

  lesson.lesson_sections = lesson.lesson_sections.map((s, i) => ({
    ...s,
    content: parsed.lessonSectionsContent[i],
  }));

  lesson.approximate_duration = parsed.approxDurationMinutes;
  await UpdateLessonSections(lesson.lesson_id, lesson);

  return lesson;
}
```

**Why this matters:**

- AI output is **schema-locked**
- Section order is **preserved**
- Content becomes **deterministic for the UI**
- Final state is stored in Supabase for persistence + dashboard continuity

### Deterministic ID generation

Clarity generates consistent entity IDs for lessons/sections/units.

```tsx
function generateId(prefix: string, characters: number = 10) {
  let id = `${prefix}-`;
  const availableChars = "abcdefghijklmnopqrstuvwxyz1234567890";

  for (let i = 0; i < characters; i++) {
    const c =
      availableChars[Math.floor(Math.random() * (availableChars.length - 1))];
    id += Math.random() > 0.5 ? c.toUpperCase() : c;
  }

  return id;
}
```

## Installation

```bash
git clone [https://github.com/the-pro-coder/clarity](https://github.com/the-pro-coder/clarity)
cd clarity
npm install
npm run dev
```

## Roadmap

- Advanced personalization engine
- Performance analytics dashboard
- Teacher portal (To be added in later production stage)
- Gamification layer
- AI-based learning style detection

License: MIT License.
