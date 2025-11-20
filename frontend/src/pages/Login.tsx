import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import { loginUser, requestOtp } from '../lib/auth';
import { getErrorMessage } from '../lib/errors';
import Alert from '../components/Alert';

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await loginUser({ email, password, device: 'Chrome/Linux' });
      setInfo('Inicio de sesión exitoso. Te enviamos un código de verificación.');
      nav(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  const onPasswordless = async () => {
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await requestOtp({ email, device: 'Chrome/Linux' });
      setInfo('Te enviamos un código. Revísalo e introdúcelo.');
      nav(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'No se pudo enviar el código');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="h1">Iniciar sesión</h2>
        <p className="p-muted">Accede con tu correo y contraseña o usa un código OTP.</p>
      </div>

      <FormInput
        label="Correo"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Contraseña"
        name="password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && <Alert kind="error">{error}</Alert>}
      {info && <Alert kind="success">{info}</Alert>}

      <button className="btn btn-primary w-full" type="submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Entrar (con contraseña)'}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link to="/register">Crear cuenta</Link>
        <button type="button" onClick={onPasswordless} className="btn btn-ghost" disabled={!email || submitting}>
          Entrar con código (sin contraseña)
        </button>
      </div>
    </form>
  );
}
