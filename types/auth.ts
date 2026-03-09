export interface AuthUser {
  name: string;
  email: string;
  phone_number?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: AuthUser;
}

export interface RegisterPayload {
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
