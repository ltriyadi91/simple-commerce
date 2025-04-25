import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});
