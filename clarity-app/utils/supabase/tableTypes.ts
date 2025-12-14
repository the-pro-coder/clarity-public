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
  current_lesson_ids: string[];
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
