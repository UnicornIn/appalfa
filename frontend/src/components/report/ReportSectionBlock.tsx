import type { ReportSection } from '../../types/api';
import { Paragraphs } from '../ui/RichText';

export function ReportSectionBlock({ section }: { section: ReportSection }) {
  const { id, title, lead, text, items, note } = section;
  return (
    <div className={`rblock${id === 'reading' ? ' strong' : ''}`}>
      <h3>{title}</h3>
      {lead && <p className="lead">{lead}</p>}
      {text && <Paragraphs text={text} />}
      {items && id === 'plan' && (
        <div>
          {items.map((item) => (
            <div className="week" key={item.label}>
              <b>{item.label}</b>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      )}
      {items && id !== 'plan' && (
        <ul className={`qlist${id === 'baseline' ? ' facts' : ''}`}>
          {items.map((item) => (
            <li key={item.label}>
              <b>{item.label}</b>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
      {note && (
        <p className="small" style={{ margin: items ? '14px 0 0' : 0 }}>
          {note}
        </p>
      )}
    </div>
  );
}
