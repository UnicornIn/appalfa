import { Logo } from '../ui/Logo';

export function Topbar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <Logo to="/" />
        <nav className="topnav" aria-label="Principal">
          <a className="hide-s" href="#como">
            Cómo funciona
          </a>
          <a className="hide-s" href="#recibes">
            Qué recibes
          </a>
          <a className="hide-s" href="#privacidad">
            Privacidad
          </a>
          <a href="#medico">Hablar con un médico</a>
        </nav>
      </div>
    </div>
  );
}
