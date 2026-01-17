import { apiFetch } from "./apiClient";

export interface RequestOtpPayload {
  email: string;
  requestType: 'SIGNUP' | 'FORGOT_PASSWORD' | 'EMAIL_UPDATE';
}

export interface RequestOtpResponse {
  success?: boolean;
  message?: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  otp: string;
  password: string;
}

export interface SignUpResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function requestOtp(email: string, requestType: 'SIGNUP' | 'FORGOT_PASSWORD' | 'EMAIL_UPDATE'): Promise<RequestOtpResponse | void> {
  if (!email || !email.trim()) {
    throw new Error("Email is required");
  }

  const payload: RequestOtpPayload = {
    email: email.trim(),
    requestType
  };

  const result = await apiFetch<RequestOtpResponse | void>(
    `/v1/auth/user/request-otp`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return result;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image_url?: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  image_url?: string;
  email?: string;
  otp?: string;
}

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  const result = await apiFetch<SignUpResponse>("/v1/auth/user/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const result = await apiFetch<LoginResponse>("/v1/auth/user/login", {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return result;
}

export async function getUserProfile(): Promise<UserProfile> {
  const result = await apiFetch<UserProfile>("/v1/auth/user/profile", {
    method: "GET",
    credentials: "include",
  });

  return result;
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/v1/auth/user/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const result = await apiFetch<UserProfile>("/v1/auth/user/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return result;
}

export interface OAuth2AuthorizeResponse {
  authorization_url: string;
}

export async function initiateGoogleOAuth(): Promise<OAuth2AuthorizeResponse> {
  const authUrl = `/api/backend/v0/oauth2/authorize`;
  return { authorization_url: authUrl };
}

export interface OAuth2CallbackPayload {
  code: string;
  state?: string;
}

export interface OAuth2CallbackResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image_url?: string;
  };
}

export async function handleOAuthCallback(payload: OAuth2CallbackPayload): Promise<OAuth2CallbackResponse> {
  const result = await apiFetch<OAuth2CallbackResponse>("/v0/oauth2/callback", {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return result;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export interface ResetPasswordResponse {
  id: string;
  name: string;
  email: string;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const result = await apiFetch<ResetPasswordResponse>("/v1/auth/user/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result;
}
