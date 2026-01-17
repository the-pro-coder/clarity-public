import { LessonSectionContent } from "@/components/custom/lessons/lesson/LessonCard";

export type User = {
  id?: number;
  user_id: string;
  created_at?: string;
  email: string;
};
export type Profile = {
  id?: number;
  user_id: string;
  created_at?: string;
  name: string;
  last_name: string;
  public_username: string;
  dedication_time: string;
  interest_areas: string[];
  current_lesson_ids: string[] | null;
  confidence_status: { area: string; status: string }[];
  grade_level: string;
};

export type Preferences = {
  user_id: string;
  id?: string;
  created_at?: string;
  preferred_subject?: string;
  hints_style?: string;
  explanation_length?: string;
  updated_at?: string;
};

export type Unit = {
  topic_ids: string[];
  unit_id: string;
  title: string;
  number: number;
  subject: string;
  tags: string[];
  grade: string;
  description: string;
  image_url: string;
  user_id: string;
};

export type Roadmap = {
  user_id: string;
  unit_ids: { subject: string; ids: string[] }[];
};

export type LessonSection = {
  type: "practice" | "theory" | "creativity";
  title: string;
  exp: number;
  content?: LessonSectionContent;
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
    | "diagnostic";
  tags: string[];
  status: "not started" | "completed" | "in progress";
  percentage_completed: number;
  expected_learning: string;
  user_id: string;
  lesson_sections: LessonSection[];
};

export type Topic = {
  title: string;
  tags: string[];
  subject: string;
  grade: string;
  description: string;
  lesson_ids: string[];
};
