import type { AppointmentPayload, ExampleReportInfo, FeedbackPayload, Report } from '../types/api';
import { request } from './http';

export function submitFeedback(payload: FeedbackPayload): Promise<{ saved: boolean }> {
  return request('/feedback', { method: 'POST', body: payload });
}

/** The session token (if any) lets the server link the assessment when he authorised sharing. */
export function requestAppointment(payload: AppointmentPayload): Promise<{ id: string }> {
  return request('/appointments', { method: 'POST', body: payload, auth: true });
}

export function fetchExampleReports(): Promise<ExampleReportInfo[]> {
  return request('/example-reports');
}

export function fetchExampleReport(key: string): Promise<Report> {
  return request(`/example-reports/${encodeURIComponent(key)}`);
}
