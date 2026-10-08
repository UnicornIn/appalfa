import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/** Shared chrome: the film-grain overlay and scroll reset on route changes. */
export function RootLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Outlet />
    </>
  );
}
