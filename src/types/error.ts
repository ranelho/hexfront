export interface ApiErrorResponse {
  details: Record<string, string> | null;
  error: string;
  message: string;
  timestamp: string;
  status: string;
  code: number;
  uuid: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorState {
  general: string | null;
  validations: ValidationError[];
} 