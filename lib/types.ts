export type VisitKind = "local" | "out_of_area" | "virtual";
export type BudgetType = "set" | "partial" | "grant";
export type ApplicationStatus = "pending" | "approved" | "rejected" | "more_info";
export type AvailabilityStatus = "open" | "full" | "limited";

export interface Book {
  id?: string;
  title: string;
  year?: number;
  publisher?: string;
  isbn?: string;
  cover_color: string;
  type: "picture_book" | "middle_grade" | "young_adult" | "nonfiction";
}

export interface VisitOffering {
  kind: VisitKind;
  base_price: number;
  unit: "day" | "session";
  local_radius_miles?: number;
  travel_policy?: "at_cost" | "flat_fee";
  flat_travel_fee?: number;
  min_days?: number;
  includes: string[];
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  email?: string;
  tagline: string;
  bio: string;
  photo_url?: string;
  location_city: string;
  location_state: string;
  genres: string[];
  grade_range: string[];
  languages: string[];
  themes?: string[];
  books: Book[];
  visit_offerings: VisitOffering[];
  local_radius_miles: number;
  offers_grant_visits: boolean;
  grant_visits_per_year: number;
  grant_visits_remaining: number;
  website_url?: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
}

export interface SchoolRequest {
  id?: string;
  author_id?: string;
  school_name: string;
  school_type: string[];
  school_city: string;
  school_state: string;
  school_website?: string;
  requester_name: string;
  requester_role: string;
  requester_email: string;
  grades: string[];
  visit_kind: VisitKind;
  date_earliest: string;
  date_latest: string;
  student_count?: number;
  timing_notes?: string;
  budget_type: BudgetType;
  budget_amount?: number;
  grant_need_reason?: string;
  grant_staff_lead?: string;
  grant_prep_plan?: string;
  success_description: string;
  themes: string[];
  notes?: string;
  confirmed_staff_lead: boolean;
  status: "pending" | "matched" | "booked" | "completed" | "cancelled";
  created_at?: string;
}

export interface AuthorApplication {
  id?: string;
  name: string;
  email: string;
  website_url?: string;
  amazon_url?: string;
  book_title: string;
  publisher: string;
  isbn?: string;
  years_visiting_schools: number;
  school_visit_references?: string;
  background_check_consent: boolean;
  why_join: string;
  status: ApplicationStatus;
  auto_check_passed?: boolean;
  auto_check_notes?: string;
  created_at?: string;
}
