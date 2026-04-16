export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  preferredCurrency: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  preferredCurrency: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}