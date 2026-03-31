export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface TokenPayload {
  sub: string;
  userId: number;
  roles: string[];
  iat: number;
  exp: number;
}
