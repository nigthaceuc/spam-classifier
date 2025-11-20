import { useRef } from 'react';

type OtpInputProps = {
  length?: number;
  label?: string;
  value: string;
  onChangeCode: (code: string) => void;
};

export default function OtpInput({
  length = 6,
  label = 'Código OTP',
  value,
  onChangeCode,
}: OtpInputProps) {
  const inputs = Array.from({ length });
  const refs = useRef<HTMLInputElement[]>([]);

  const setDigit = (i: number, digit: string) => {
    const chars = value.split('');
    chars[i] = digit;
    onChangeCode(chars.join('').slice(0, length));
  };

  const onChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    setDigit(i, val);
    if (val && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const curr = value[i] ?? '';
    if (e.key === 'Backspace') {
      if (curr) setDigit(i, '');
      else if (i > 0) refs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="mb-4">
      <label className="label">{label}</label>
      <div className="otp-grid" role="group" aria-label={label}>
        {inputs.map((_, i) => (
          <input
            key={i}
            inputMode="numeric"
            aria-label={`Dígito ${i + 1}`}
            maxLength={1}
            className="otp-cell"
            ref={(el) => { if (el) refs.current[i] = el; }}
            value={value[i] ?? ''}
            onChange={(e) => onChange(i, e)}
            onKeyDown={(e) => onKeyDown(i, e)}
          />
        ))}
      </div>
      <p className="helper mt-1">Ingresa el código de {length} dígitos enviado a tu correo.</p>
    </div>
  );
}
