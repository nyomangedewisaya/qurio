const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { requireAuth = true, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (requireAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('qurio_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan pada server');
    }

    return data as T;
  } catch (error: any) {
    console.error(`[API Error - ${endpoint}]:`, error.message);
    throw error;
  }
};