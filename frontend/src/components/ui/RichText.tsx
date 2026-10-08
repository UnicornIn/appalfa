import { Fragment } from 'react';

/** Renders server text: **bold** marks emphasis. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Blank lines split paragraphs. */
export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split('\n\n')
        .filter(Boolean)
        .map((paragraph, i) => (
          <p key={i} className={className}>
            <Inline text={paragraph} />
          </p>
        ))}
    </>
  );
}
