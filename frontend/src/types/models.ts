export type Role = 'ADMIN' | 'AUTHOR' | 'PARTICIPANT';
export type Status = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  phone?: string | null;
  status: Status;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalAuthors: number;
  totalQuizzes: number;
  totalAttempts: number;
}