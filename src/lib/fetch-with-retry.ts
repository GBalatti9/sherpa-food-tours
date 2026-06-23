/**
 * Fetch wrapper with retry logic for transient errors.
 * Retries on: network errors, HTTP 5xx, HTTP 429.
 * Does NOT retry on: HTTP 4xx (except 429).
 */
export async function fetchWithRetry(
    url: string,
    options?: RequestInit & { next?: { revalidate?: number } },
    retries = 2,
    delay = 500
): Promise<Response> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);

            // Don't retry client errors (except 429 rate limit)
            if (!response.ok && response.status !== 429 && response.status < 500) {
                return response;
            }

            // Success - return response
            if (response.ok) {
                return response;
            }

            // Server error or rate limit - retry if attempts remain
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
                continue;
            }

            return response;
        } catch (error) {
            // Network error (TypeError: Failed to fetch, DNS, timeout, etc.)
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
                continue;
            }
            throw error;
        }
    }

    // TypeScript safety - should never reach here
    throw new Error(`fetchWithRetry: exhausted ${retries} retries for ${url}`);
}
