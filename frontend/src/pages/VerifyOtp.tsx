import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import { setToken, verifyOtp, requestOtp } from '../lib/auth';
import { getErrorMessage } from '../lib/errors';
import Alert from '../components/Alert';

export default function VerifyOtp() {
  const nav = useNavigate();
  const { search } = useLocation();
  const email = useMemo(() => new URLSearchParams(search).get('email') ?? '', [search]);

  const [code, setCode] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>('Te enviamos un código a tu correo.');

  useEffect(() => {
    setCanResend(false);
    setSecondsLeft(30);
    const tick = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(tick);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [email]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErr('El código debe tener 6 dígitos.');
      return;
    }
    setSubmitting(true);
    setErr(null);
    setInfo(null);
    try {
      const res = await verifyOtp({ email, code });
      if (res.token) setToken(res.token);
      setInfo('Inicio de sesión exitoso. ¡Bienvenido!');
      setTimeout(() => nav('/messages'), 700); // o /dashboard
    } catch (e: unknown) {
      setErr(getErrorMessage(e) || 'OTP inválido o expirado');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErr(null);
    setInfo(null);
    try {
      await requestOtp({ email, device: 'Chrome/Linux' });
      setInfo('Hemos reenviado tu código. Revisa tu correo.');
      setCanResend(false);
      setSecondsLeft(30);
    } catch (e: unknown) {
      setErr(getErrorMessage(e) || 'No se pudo reenviar el código');
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="h1">Verificar código</h2>
        <p className="p-muted">Introduce el código enviado a <b>{email}</b>.</p>
      </div>

      <div className="otp-wrap">
        <OtpInput length={6} value={code} onChangeCode={setCode} />
      </div>

      {err && <Alert kind="error">{err}</Alert>}
      {info && <Alert kind="success">{info}</Alert>}

      <button className="btn btn-primary w-full" type="submit" disabled={submitting}>
        {submitting ? 'Verificando...' : 'Verificar'}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link to="/login">Regresar</Link>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className="btn btn-ghost disabled:opacity-40"
        >
          {canResend ? 'Reenviar código' : `Reenviar en ${secondsLeft}s`}
        </button>
      </div>
    </form>
  );
}
