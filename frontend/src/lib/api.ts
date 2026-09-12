export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://sudhaarai.onrender.com'
    : 'http://127.0.0.1:8000');

/**
 * Retrieves the stored officer session from localStorage, including the JWT access token.
 */
export function getStoredUserSession(): {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
  role?: string;
  department?: string;
  category?: string;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('sudhaar_user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error('Error reading user session:', e);
    return null;
  }
}

/**
 * Returns Authorization header with Bearer token if session exists.
 */
export function getAuthHeaders(): Record<string, string> {
  const session = getStoredUserSession();
  if (session?.token) {
    return {
      Authorization: `Bearer ${session.token}`,
    };
  }
  return {};
}

/**
 * Enhanced fetch wrapper that automatically prepends API_BASE_URL and attaches Authorization Bearer token.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const authHeaders = getAuthHeaders();

  const headers: Record<string, string> = {
    ...authHeaders,
    ...(options.headers as Record<string, string> || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
