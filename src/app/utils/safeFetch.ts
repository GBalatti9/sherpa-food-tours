export async function safeFetch<T>(fn: () => Promise<T>, fallback: T, context?: string): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      console.error(`safeFetch failed${context ? ' (' + context + ')' : ''}:`, err);
      return fallback;
    }
  }
  