import type { Chapter, Pause, Question, Questionnaire, StoredAnswer } from '../types/api';

export type FlowItem =
  | { kind: 'question'; question: Question }
  | { kind: 'interstitial'; chapter: Chapter }
  | { kind: 'pause'; pause: Pause }
  | { kind: 'payment' };

/**
 * Lays out the journey from the questionnaire the server sent: chapter intros before the first
 * question of each chapter, the payment gate after the question that opens the Ruta, and
 * reflective pauses where the server asks for them.
 */
export function buildFlowItems(q: Questionnaire): FlowItem[] {
  const chapters = new Map(q.chapters.map((c) => [c.id, c]));
  const items: FlowItem[] = [];
  let lastChapter = 0;
  for (const question of q.questions) {
    if (question.chapter !== lastChapter) {
      lastChapter = question.chapter;
      const chapter = chapters.get(question.chapter);
      if (chapter?.interstitial) items.push({ kind: 'interstitial', chapter });
    }
    items.push({ kind: 'question', question });
    if (question.id === q.payment_after) items.push({ kind: 'payment' });
    for (const pause of q.pauses) {
      if (pause.after === question.id) items.push({ kind: 'pause', pause });
    }
  }
  return items;
}

export function indexOfQuestion(items: FlowItem[], questionId: string): number {
  return items.findIndex((i) => i.kind === 'question' && i.question.id === questionId);
}

export function indexOfPayment(items: FlowItem[]): number {
  return items.findIndex((i) => i.kind === 'payment');
}

/** Chapter shown in the progress header for the item at `index`. */
export function chapterAt(items: FlowItem[], index: number, q: Questionnaire): Chapter | undefined {
  for (let i = index; i >= 0; i--) {
    const item = items[i];
    if (item?.kind === 'question') return q.chapters.find((c) => c.id === item.question.chapter);
    if (item?.kind === 'interstitial') return item.chapter;
  }
  return q.chapters[0];
}

export function pauseText(pause: Pause, answers: Record<string, StoredAnswer>): string {
  const given = answers[pause.source]?.value;
  return (typeof given === 'string' && pause.texts[given]) || pause.default;
}

export function answeredCount(q: Questionnaire, answers: Record<string, StoredAnswer>): number {
  return q.questions.filter((question) => answers[question.id] !== undefined).length;
}
