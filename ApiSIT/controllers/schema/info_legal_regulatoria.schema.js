import { z } from 'zod'

export const legalInfoSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  website: z.string().url().optional() // Sitio web opcional y debe ser una URL válida
})
