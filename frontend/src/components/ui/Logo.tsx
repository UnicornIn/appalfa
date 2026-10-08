import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  negative?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({ to, negative = false, className = '', style }: LogoProps) {
  const classes = `logo${negative ? ' neg' : ''} ${className}`.trim();
  const content = (
    <>
      alfa<span className="p">+</span>
    </>
  );
  return to ? (
    <Link className={classes} style={style} to={to} aria-label="alfa+">
      {content}
    </Link>
  ) : (
    <span className={classes} style={style}>
      {content}
    </span>
  );
}
