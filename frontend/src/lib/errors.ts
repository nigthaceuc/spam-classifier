// src/lib/errors.ts
export function getErrorMessage(e: unknown): string {
    if (e instanceof Error && e.message) return e.message;
    if (typeof e === 'string') return e;
    try {
      // por si tu fetch parsea JSON con { message }
      const maybe = e as { message?: unknown };
      if (maybe && typeof maybe.message === 'string') return maybe.message;
    } catch { /* ignore */ }
    return 'Unexpected error';
  }
  