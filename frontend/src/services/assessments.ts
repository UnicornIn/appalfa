import type {
  AnswerPayload,
  Assessment,
  Completion,
  Order,
  PaymentMethod,
  PaymentStarted,
  Questionnaire,
  ReportResponse,
  SavedAnswer,
  StartedAssessment,
} from '../types/api';
import { request, requestBlob } from './http';
import { clearSession, readSession, saveSession } from './sessionStore';

let questionnaireRequest: Promise<Questionnaire> | null = null;

/** Step 1. Loaded once; later calls reuse the same request. A failure is not cached. */
export function fetchQuestionnaire(): Promise<Questionnaire> {
  questionnaireRequest ??= request<Questionnaire>('/questionnaire').catch((error: unknown) => {
    questionnaireRequest = null;
    throw error;
  });
  return questionnaireRequest;
}

/** Step 2. Creates the assessment from the answer to the first question and keeps the token. */
export async function startAssessment(payload: AnswerPayload): Promise<StartedAssessment> {
  const started = await request<StartedAssessment>('/assessments', {
    method: 'POST',
    body: payload,
  });
  saveSession({ assessmentId: started.id, token: started.token });
  return started;
}

function currentId(): string {
  const session = readSession();
  if (!session) throw new Error('No hay una evaluación en curso.');
  return session.assessmentId;
}

export const hasSession = (): boolean => readSession() !== null;
export const forgetSession = clearSession;

/** Step 6. Saved answers and the question he stopped at. */
export function fetchAssessment(): Promise<Assessment> {
  return request<Assessment>(`/assessments/${currentId()}`, { auth: true });
}

/** Step 5. */
export function saveAnswer(questionId: string, payload: AnswerPayload): Promise<SavedAnswer> {
  return request<SavedAnswer>(`/assessments/${currentId()}/answers/${questionId}`, {
    method: 'PUT',
    body: payload,
    auth: true,
  });
}

/** Step 7. */
export function completeAssessment(): Promise<Completion> {
  return request<Completion>(`/assessments/${currentId()}/complete`, {
    method: 'POST',
    auth: true,
  });
}

/** Step 3. The gateway sends him back to `returnUrl`. */
export function startPayment(method: PaymentMethod, returnUrl: string): Promise<PaymentStarted> {
  return request<PaymentStarted>(`/assessments/${currentId()}/payment`, {
    method: 'POST',
    body: { method, return_url: returnUrl },
    auth: true,
  });
}

/** Step 4. */
export function fetchOrder(orderId: string): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(orderId)}`, { auth: true });
}

/** Step 8. */
export function fetchReport(): Promise<ReportResponse> {
  return request<ReportResponse>(`/assessments/${currentId()}/report`, { auth: true });
}

/** Step 9. */
export function downloadReportPdf(): Promise<Blob> {
  return requestBlob(`/assessments/${currentId()}/report.pdf`, { auth: true });
}
