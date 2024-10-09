import { z } from 'zod'

export const contactSchema = z.object({
  entity_id: z.number().int().positive({ message: 'Entity ID must be a positive integer' }),
  contacts: z.array(
    z.object({
      contact_type: z.enum(['phone', 'email'], { message: 'Type must be either "telefono" or "email"' }),
      contact_value: z.string().min(1, 'Required')
    })
  )

})
