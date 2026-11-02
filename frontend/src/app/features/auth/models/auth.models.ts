export interface ApiFieldError {
  field: string;
  code: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  errors: ApiFieldError[];
}

export interface ApiClientError {
  status: number;
  code: string;
  message: string;
  errors: ApiFieldError[];
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  familyName: string;
  email: string;
  password: string;
}

export interface AuthUserResponse {
  userId: number;
  familyName: string;
  email: string;
}
