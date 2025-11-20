type Kind = 'success' | 'error' | 'info';

export default function Alert({ kind = 'info', children }: { kind?: Kind; children: React.ReactNode }) {
  const styles: Record<Kind, React.CSSProperties> = {
    success: { background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.35)', color: '#065f46' },
    error:   { background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', color: '#7f1d1d' },
    info:    { background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.35)', color: '#1e3a8a' },
  };

  const role = kind === 'error' ? 'alert' : 'status';

  return (
    <div role={role} style={{ ...styles[kind], padding: '10px 12px', borderRadius: 10 }}>
      {children}
    </div>
  );
}
