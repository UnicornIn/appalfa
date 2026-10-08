import { ApiError } from '../../services/http';
import { Button } from './Button';

export function Loading({
  label = 'Cargando…',
  center = false,
}: {
  label?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'state-center' : undefined} role="status" aria-live="polite">
      <div className="loader" aria-hidden="true" />
      <span className="eyebrow" style={{ marginBottom: 0 }}>
        {label}
      </span>
    </div>
  );
}

export function errorMessage(error: Error): string {
  if (error instanceof ApiError && error.isNetwork) {
    return 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  }
  return error.message || 'Algo salió mal. Inténtalo de nuevo.';
}

interface ErrorStateProps {
  error: Error;
  title?: string;
  onRetry?: () => void;
  center?: boolean;
}

export function ErrorState({
  error,
  title = 'No se pudo cargar',
  onRetry,
  center,
}: ErrorStateProps) {
  return (
    <div className={center ? 'state-center' : undefined}>
      <div className="state" role="alert">
        <span className="eyebrow">{title}</span>
        <p>{errorMessage(error)}</p>
        {onRetry && (
          <Button variant="ghost" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="state">
      <span className="eyebrow">{title}</span>
      <p style={{ margin: 0 }}>{text}</p>
    </div>
  );
}
