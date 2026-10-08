import { useCallback, useEffect, useState } from 'react';
import type { ApiError } from '../services/http';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: ApiError | Error }
  | { status: 'ready'; data: T };

/** Runs `load` on mount (and on `reload`), exposing loading / error / ready states. */
export function useAsyncData<T>(
  load: () => Promise<T>,
  deps: readonly unknown[] = [],
): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    load().then(
      (data) => !cancelled && setState({ status: 'ready', data }),
      (error: unknown) =>
        !cancelled &&
        setState({ status: 'error', error: error instanceof Error ? error : new Error('Error') }),
    );
    return () => {
      cancelled = true;
    };
    // `load` always reads the same inputs as `deps`, which drive the reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...deps]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
