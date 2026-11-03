import { apiClient } from "./axios";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: "user" | "admin" | "superAdmin";
  image?: string;
  isEmailVerified?: boolean;
  phoneNumber?: number;
  address?: string;
  createdAt?: string;
}

export interface AuthTokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface BackendResponse<T> {
  code: number;
  message: string;
  data: {
    type?: string;
    attributes?: T;
    [key: string]: unknown;
  };
}

export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  fullName?: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superAdmin";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

export interface ProfileResult {
  user: User;
  securitySettings?: unknown;
}

// 1. Register API
export const registerApi = async (data: RegisterPayload): Promise<BackendResponse<Record<string, unknown>>> => {
  const response = await apiClient.post<BackendResponse<Record<string, unknown>>>("/auth/register", data);
  return response.data;
};

// 2. Verify Email (OTP) API
export const verifyEmailApi = async (
  data: VerifyEmailPayload
): Promise<BackendResponse<AuthResult>> => {
  const response = await apiClient.post<BackendResponse<AuthResult>>("/auth/verify-email", data);
  return response.data;
};

// 3. Login API
export const loginApi = async (
  data: LoginPayload
): Promise<BackendResponse<AuthResult>> => {
  const response = await apiClient.post<BackendResponse<AuthResult>>("/auth/login", data);
  return response.data;
};

// 4. Get Current User Profile API
export const getProfileApi = async (): Promise<BackendResponse<ProfileResult | User>> => {
  const response = await apiClient.get<BackendResponse<ProfileResult | User>>("/users/self/in");
  return response.data;
};

// 5. Logout API
export const logoutApi = async (refreshToken: string): Promise<BackendResponse<null>> => {
  const response = await apiClient.post<BackendResponse<null>>("/auth/logout", { refreshToken });
  return response.data;
};

// 6. Forgot Password API (Sends OTP)
export const forgotPasswordApi = async (email: string): Promise<BackendResponse<Record<string, unknown>>> => {
  const response = await apiClient.post<BackendResponse<Record<string, unknown>>>("/auth/forgot-password", { email });
  return response.data;
};

// 7. Reset Password API
export const resetPasswordApi = async (data: ResetPasswordPayload): Promise<BackendResponse<Record<string, unknown>>> => {
  const response = await apiClient.post<BackendResponse<Record<string, unknown>>>("/auth/reset-password", data);
  return response.data;
};

// 8. Change Password API (Authenticated)
export const changePasswordApi = async (data: ChangePasswordPayload): Promise<BackendResponse<Record<string, unknown>>> => {
  const response = await apiClient.post<BackendResponse<Record<string, unknown>>>("/auth/change-password", data);
  return response.data;
};

// 9. Update Current User Profile API (Name, Email, etc.)
export interface UpdateProfilePayload {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export const updateProfileApi = async (data: UpdateProfilePayload): Promise<BackendResponse<User>> => {
  const response = await apiClient.patch<BackendResponse<User>>("/users/self/update", data);
  return response.data;
};

