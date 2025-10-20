import { z } from "zod";

export const createAccountSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  avatarUrl: z.string().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  username: z.string().min(3).max(50),
  avatarUrl: z.string().url().nullable(),
  password: z.string().min(8).max(100),
});

export const connectResponseSchema = z.object({
  token: z.string(),
  user: z.lazy(() => userSchema),
});

export const payloadUserSchema = z.object({
  firstName: z.string().min(1).max(500),
  lastName: z.string().min(1).max(500),
  avatarUrl: z.string().url().nullable(),
  email: z.string().min(1).max(500),
  username: z.string().min(3).max(500),
});

export type UserDto = z.infer<typeof userSchema>;
export type CreateAccountDto = z.infer<typeof createAccountSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ConnectResponseDto = z.infer<typeof connectResponseSchema>;
export type PayloadUserDto = z.infer<typeof payloadUserSchema>;
