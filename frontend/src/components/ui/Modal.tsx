import { useEffect, useRef } from 'react';

interface ModalProps {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ label, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal-in"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button className="close" type="button" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
