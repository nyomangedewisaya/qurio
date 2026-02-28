export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: PaginationMeta;
}