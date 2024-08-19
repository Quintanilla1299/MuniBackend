import { z } from 'zod'
import { personSchema } from './person.schema.js'
export const userSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers').optional(),
  email: z.string()
    .email('Invalid email address').optional(),
  password: z.string()
    .min(10, 'Password must be at least 10 characters long')
    .max(100, 'Password must be less than 100 characters'),
  person: personSchema.optional()
})
