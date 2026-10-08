import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export function NotFoundPage() {
  return (
    <div className="wrap" style={{ maxWidth: 760, paddingTop: 44, paddingBottom: 80 }}>
      <Logo to="/" />
      <div className="state-center">
        <span className="eyebrow">Error 404</span>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: 22 }}>
          Esta página
          <br />
          no existe
        </h1>
        <p className="lede">Puede que el enlace esté incompleto o que la página haya cambiado.</p>
        <div>
          <Link className="btn btn-solid" to="/">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
