export interface User {
  id: number;
  email: string;
  name: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
