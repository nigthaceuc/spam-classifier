import { useEffect, useState } from 'react';
import { sendAndClassifyMessage, getClassificationHistory } from '../lib/messages';
import type { ClassifiedMessage } from '../lib/messages';
import { getErrorMessage } from '../lib/errors';
import Alert from '../components/Alert';

export default function MessagesPage() {
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<ClassifiedMessage | null>(null);
  const [history, setHistory] = useState<ClassifiedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoadingHistory(true);
      setError(null);
      try {
        const data = await getClassificationHistory();
        setHistory(data.sort((a, b) => b.id - a.id));
      } catch (e: unknown) {
        setError(getErrorMessage(e) || 'No se pudo cargar el historial');
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await sendAndClassifyMessage(message.trim());
      setLastResult(res);
      setHistory(prev => [res, ...prev]);
      setMessage('');
    } catch (e: unknown) {
      setError(getErrorMessage(e) || 'No se pudo clasificar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-10">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
              📨 Clasificador de Spam
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mt-1">
              Escribe un mensaje y el sistema usará un modelo de IA para determinar si se trata de
              <span className="font-semibold text-amber-300"> SPAM</span> o un mensaje legítimo.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Modelo de IA en línea</span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Formulario + resultado */}
          <main className="space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-2xl shadow-slate-950/60 backdrop-blur p-5 md:p-6">
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-slate-100"
                    htmlFor="message"
                  >
                    Mensaje a clasificar
                  </label>
                  <p className="text-xs text-slate-400">
                    Pega aquí el texto de un correo, SMS, notificación, etc. que sospeches que pueda
                    ser spam.
                  </p>
                  <textarea
                    id="message"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent min-h-[130px] resize-y"
                    placeholder="Ejemplo: &quot;Felicidades, ganaste un premio. Haz clic en este enlace para reclamarlo...&quot;"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                {error && <Alert kind="error">{error}</Alert>}

                {lastResult && (
                  <div className="mt-1">
                    <div
                      className={`flex items-start gap-3 rounded-xl border px-3 py-3 text-sm shadow-md ${
                        lastResult.isSpam
                          ? 'border-red-500/50 bg-red-950/40 text-red-100'
                          : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-100'
                      }`}
                    >
                      <div className="mt-0.5 text-lg">
                        {lastResult.isSpam ? '🚫' : '✅'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">
                            {lastResult.isSpam ? 'Este mensaje es SPAM' : 'Este mensaje parece legítimo (HAM)'}
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                              lastResult.isSpam
                                ? 'bg-red-700/70 text-red-50'
                                : 'bg-emerald-700/70 text-emerald-50'
                            }`}
                          >
                            etiqueta: {lastResult.label}
                          </span>
                        </div>
                        {lastResult.classifiedAt && (
                          <p className="text-[11px] opacity-80">
                            Clasificado el:{' '}
                            {new Date(lastResult.classifiedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading || !message.trim()}
                >
                  {loading ? 'Clasificando mensaje...' : 'Clasificar mensaje'}
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  Los mensajes se guardan en el historial para que puedas revisarlos después.
                </p>
              </form>
            </div>
          </main>

          {/* Historial */}
          <aside className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
                Historial de clasificaciones
              </h2>
              {!loadingHistory && history.length > 0 && (
                <span className="text-[11px] text-slate-400">
                  Total: {history.length} mensaje{history.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-xl shadow-slate-950/60 backdrop-blur p-3 md:p-4">
              {loadingHistory && (
                <p className="text-xs text-slate-400">Cargando historial...</p>
              )}

              {!loadingHistory && history.length === 0 && (
                <p className="text-xs text-slate-400">
                  Todavía no hay mensajes clasificados. Prueba enviando uno desde el formulario.
                </p>
              )}

              {!loadingHistory && history.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scroll">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="group border border-slate-700/80 rounded-xl p-2.5 text-xs bg-slate-900/70 hover:border-emerald-500/70 hover:bg-slate-900 transition-colors flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-200">
                            #{item.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              item.isSpam
                                ? 'bg-red-900/70 text-red-100 border border-red-600/60'
                                : 'bg-emerald-900/70 text-emerald-100 border border-emerald-600/60'
                            }`}
                          >
                            {item.isSpam ? 'SPAM' : 'HAM'}
                            <span className="opacity-70">· {item.label}</span>
                          </span>
                        </div>
                        {item.classifiedAt && (
                          <span className="text-[10px] text-slate-500 text-right">
                            {new Date(item.classifiedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-200/90 break-words leading-snug line-clamp-3 group-hover:line-clamp-none">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
