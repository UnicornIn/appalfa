/** Wire types for the ALFA+ API (see the "How the app talks to the server" spec). */

export interface Money {
  amount: number;
  currency: string;
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}

// ---- questionnaire --------------------------------------------------------------------------
export type QuestionType =
  | 'single_choice'
  | 'ehs'
  | 'scale'
  | 'multi_choice'
  | 'number'
  | 'body_metrics'
  | 'text';

export type OptionValue = string | number;

export interface QuestionOption {
  value: OptionValue;
  label: string;
  exclusive?: boolean;
}

export interface Question {
  id: string;
  chapter: number;
  type: QuestionType;
  text: string;
  help?: string;
  why: string;
  options?: QuestionOption[];
  labels?: string[];
  min?: number;
  max?: number;
  unit?: string;
  skippable: boolean;
  checks_red_flag: boolean;
}

export interface Interstitial {
  kicker: string;
  title: string;
  text: string;
}

export interface Chapter {
  id: number;
  name: string;
  interstitial?: Interstitial;
}

export interface Pause {
  after: string;
  source: string;
  texts: Record<string, string>;
  default: string;
}

export interface Questionnaire {
  price: Money;
  payment_after: string;
  chapters: Chapter[];
  questions: Question[];
  pauses: Pause[];
}

// ---- assessments ----------------------------------------------------------------------------
export interface BodyMetrics {
  weight_kg: number;
  height_cm: number;
}

export type AnswerValue = string | number | string[] | BodyMetrics;

export type AnswerPayload =
  | { value: AnswerValue; ms_on_screen: number }
  | { skipped: true; ms_on_screen: number };

/** What the app keeps for an answered question; `skipped` answers carry no value. */
export interface StoredAnswer {
  value?: AnswerValue | null;
  skipped: boolean;
}

export interface Stop {
  flag: string;
  title: string;
  message: string;
  refund: string;
}

export interface StartedAssessment {
  id: string;
  token: string;
  state: 'in_progress';
  price: Money;
}

export interface SavedAnswer {
  saved: boolean;
  stop?: Stop;
}

export interface RouteResult {
  main: string;
  complement?: string | null;
}

export type OrderState = 'created' | 'paid' | 'failed' | 'refunded' | 'refund_pending';

export interface Assessment {
  id: string;
  state: 'in_progress' | 'completed' | 'stopped';
  created_at: string;
  payment: 'none' | OrderState;
  answers: Record<string, StoredAnswer>;
  current_question_id: string | null;
  route?: RouteResult | null;
  stop?: Stop | null;
}

export interface Completion {
  state: 'completed' | 'stopped';
  route?: RouteResult;
  report?: 'writing';
  stop?: Stop;
}

// ---- payment --------------------------------------------------------------------------------
export type PaymentMethod = 'card' | 'pse' | 'nequi';

export interface PaymentStarted {
  order_id: string;
  state: OrderState;
  checkout_url: string;
}

export interface Order {
  order_id: string;
  state: OrderState;
  amount: Money;
}

// ---- report ---------------------------------------------------------------------------------
export interface ReportMap {
  mechanism: number;
  function: number;
  desire: number;
  ejaculation: number;
  body: number;
  mind: number;
  habits: number;
}

export interface SectionItem {
  label: string;
  text: string;
}

export interface ReportSection {
  id: 'reading' | 'scale' | 'plan' | 'exams' | 'questions' | 'baseline';
  title: string;
  lead?: string;
  text?: string;
  items?: SectionItem[];
  note?: string;
}

export interface Report {
  state: 'ready';
  generated_at: string;
  engine_version: string;
  route: RouteResult;
  route_label: string;
  grade: { level: number | null; label: string };
  map: ReportMap;
  factors: { code: string; label: string }[];
  exams_suggested: string[];
  sections: ReportSection[];
  next_step: { title: string; text: string; cta_label: string };
}

export type ReportResponse = Report | { state: 'writing' };

export interface ExampleReportInfo {
  key: string;
  label: string;
}

// ---- contact --------------------------------------------------------------------------------
export type FeedbackClarity = 'si' | 'masomenos' | 'no';
export type FeedbackLostAt = 'ninguna' | 'pago' | 'preguntas' | 'resultado' | 'rutas';
export type FeedbackConfidence = 'si' | 'duda' | 'no';

export interface FeedbackPayload {
  clarity?: FeedbackClarity;
  lost_at?: FeedbackLostAt;
  confidence?: FeedbackConfidence;
  comment: string;
}

export interface AppointmentPayload {
  name: string;
  phone: string;
  reason?: string;
  slot: string;
  share_assessment: boolean;
}
