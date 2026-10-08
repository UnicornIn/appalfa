import { FlowShell } from '../components/flow/FlowShell';
import { PaymentGate } from '../components/flow/PaymentGate';
import { QuestionView } from '../components/flow/QuestionView';
import { InterstitialScreen, PauseScreen } from '../components/flow/Screens';
import { ErrorState, Loading } from '../components/ui/Feedback';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import { pauseText } from '../utils/flow';

export function EvaluationPage() {
  const flow = useAssessmentFlow();
  const { loaded, derived, item } = flow;

  if (flow.loadError) {
    return (
      <div className="flow">
        <div className="flow-body">
          <ErrorState
            error={flow.loadError}
            title="No pudimos abrir tu evaluación"
            onRetry={flow.retryLoad}
            center
          />
        </div>
      </div>
    );
  }
  if (!loaded || !derived || !item) {
    return (
      <div className="flow">
        <div className="flow-body">
          <Loading label="Abriendo tu evaluación…" center />
        </div>
      </div>
    );
  }

  const { questionnaire } = loaded;
  const chapterLabel = derived.chapter
    ? `Capítulo ${derived.chapter.id} · ${derived.chapter.name}`
    : '';

  return (
    <FlowShell
      chapterLabel={chapterLabel}
      counter={derived.counter}
      percent={derived.percent}
      syncError={flow.syncError}
      onRetrySync={flow.retrySync}
      onExit={flow.exit}
    >
      <div className="flow-body fade" key={flow.index}>
        {item.kind === 'question' && (
          <QuestionView
            key={item.question.id}
            question={item.question}
            position={questionnaire.questions.findIndex((q) => q.id === item.question.id) + 1}
            total={derived.total}
            stored={flow.answers[item.question.id]}
            busy={flow.busy}
            error={flow.actionError}
            canGoBack={flow.index > 0}
            onSubmit={(submission) => flow.submit(item.question, submission)}
            onBack={flow.goBack}
          />
        )}
        {item.kind === 'interstitial' && item.chapter.interstitial && (
          <InterstitialScreen
            content={item.chapter.interstitial}
            onBack={flow.goBack}
            onNext={flow.goForward}
          />
        )}
        {item.kind === 'pause' && (
          <PauseScreen
            text={pauseText(item.pause, flow.answers)}
            onBack={flow.goBack}
            onNext={flow.goForward}
          />
        )}
        {item.kind === 'payment' && (
          <PaymentGate
            price={questionnaire.price}
            totalQuestions={derived.total}
            paid={flow.paid}
            onBack={flow.goBack}
            onContinue={flow.goForward}
          />
        )}
      </div>
    </FlowShell>
  );
}
