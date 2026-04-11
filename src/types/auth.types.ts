export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
};
