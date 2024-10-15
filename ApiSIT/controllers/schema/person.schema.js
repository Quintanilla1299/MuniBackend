import { z } from 'zod'

export const personSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  last_name: z.string().trim().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  cedula: z.string().trim().min(9, 'Cedula must be at least 9 characters long').max(20, 'Cedula must be less than 20 characters')
})
