import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/' || pathname.includes('login');
  const isRegister = pathname.includes('register');

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <nav className="tabs" aria-label="Pestañas de autenticación">
          <Link to="/login" className={`tab ${isLogin ? 'active' : ''}`}>Iniciar sesión</Link>
          <Link to="/register" className={`tab ${isRegister ? 'active' : ''}`}>Crear cuenta</Link>
        </nav>

        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

