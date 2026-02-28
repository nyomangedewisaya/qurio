import { apiClient } from '../lib/apiClient';
import type { ApiResponse } from '../types/api';
import type { AuthResponse, User } from '../types/models';

export const authService = {
  register: (payload: any) => 
    apiClient<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      requireAuth: false, 
    }),

  login: (payload: any) => 
    apiClient<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      requireAuth: false,
    }),

//   me: () => 
//     apiClient<ApiResponse<User>>('/auth/me', {
//       method: 'GET',
//       requireAuth: true, 
//     }),
};