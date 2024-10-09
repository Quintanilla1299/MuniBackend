import { z } from 'zod'

// Esquema de validación utilizando Zod
export const educationalResourceSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  link: z.string().url('El enlace debe ser una URL válida').optional(),
  category: z.string().min(1, 'La categoría es requerida'),
  publicationDate: z.string().min(1, 'La fecha de publicación es requerida'),
  authors: z.array(z.string()).min(1, 'Se requiere al menos un autor')
})
