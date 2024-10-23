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
    .max(100, 'Password must be less than 100 characters')
    .optional(),
  person: personSchema
    .refine(data => data.first_name && data.last_name && data.last_name, {
      message: 'Person details (first_name, last_name, and cedula) are required.'
    })
}).superRefine((data, ctx) => {
  if (!data.password && ctx.path.includes('create')) {
    ctx.addIssue({
      path: ['password'],
      message: 'Password is required when creating a user.',
      code: z.ZodIssueCode.custom
    })
  }
})
