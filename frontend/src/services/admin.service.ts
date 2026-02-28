import { apiClient } from '../lib/apiClient';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { User, DashboardStats } from '../types/models';

export const adminService = {
  // Dashboard
  getDashboardStats: () =>
    apiClient<ApiResponse<DashboardStats>>('/admin/dashboard', {
      method: 'GET',
      requireAuth: true,
    }),

  // Users
  getUsers: (page: number = 1, limit: number = 5, search: string = '', role: string = 'ALL') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('q', search);
    if (role && role !== 'ALL') params.append('role', role);

    return apiClient<PaginatedResponse<User>>(`/admin/users?${params.toString()}`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  updateUser: (userId: string, payload: Partial<User>) =>
    apiClient<ApiResponse<User>>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requireAuth: true,
    }),

  deleteUser: (userId: string) =>
    apiClient<ApiResponse<null>>(`/admin/users/${userId}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // Quizzes
  getQuizzes: (page: number = 1, limit: number = 6, search: string = '', status: string = 'ALL') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('q', search);
    if (status && status !== 'ALL') params.append('status', status);

    return apiClient<PaginatedResponse<any>>(`/admin/quizzes?${params.toString()}`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  forceDeleteQuiz: (quizId: string) =>
    apiClient<ApiResponse<null>>(`/admin/quizzes/${quizId}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  getQuizBySlug: (slug: string) =>
    apiClient<ApiResponse<any>>(`/admin/quizzes/${slug}`, {
      method: 'GET',
      requireAuth: true,
    }),
};