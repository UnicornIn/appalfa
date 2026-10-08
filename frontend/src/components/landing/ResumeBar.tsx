import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssessment, forgetSession, hasSession } from '../../services/assessments';
import { Button } from '../ui/Button';

/** Offers to continue an assessment left half-way on this device (FR-10). */
export function ResumeBar() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasSession()) return;
    let cancelled = false;
    fetchAssessment().then(
      (assessment) => {
        const answered = Object.keys(assessment.answers).length;
        if (!cancelled && assessment.state === 'in_progress' && answered > 1) setVisible(true);
      },
      () => forgetSession(), // expired or unknown session: nothing to resume
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="resume-bar no-print" role="region" aria-label="Evaluación pendiente">
      <div className="wrap">
        <p className="small">Tienes una evaluación a medio camino en este dispositivo.</p>
        <div className="actions">
          <Button variant="solid" onClick={() => navigate('/evaluacion')}>
            Continuar
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              forgetSession();
              setVisible(false);
            }}
          >
            Empezar de nuevo
          </Button>
        </div>
      </div>
    </div>
  );
}
