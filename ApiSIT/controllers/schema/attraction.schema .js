import { z } from 'zod'

const imageFilenameRegex = /^[\w,\s-]+\.(jpg|jpeg|png|gif)$/i // Permite letras, números, espacios, guiones y extensiones de imagen

export const attractionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  type_attraction: z.string().min(1, 'Type of attraction is required').max(100, 'Type of attraction must be less than 100 characters'),
  website: z.string().url('Invalid URL').optional(),
  status: z.string()
    .max(50, 'State must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'State must only contain letters and spaces')
    .optional(),
  location: z.string().min(1, 'Location is required').max(255, 'Location must be less than 255 characters'),
  opening_hours: z.string().max(100, 'Opening hours must be less than 100 characters').optional(),
  contacts: z.array(
    z.object({
      contact_type: z.string(),
      contact_value: z.string()
    })
  ).optional(),
  images: z.array(
    z.object({
      filename: z.string().regex(imageFilenameRegex, 'Invalid image filename. Allowed extensions: jpg, jpeg, png, gif')
    })
  ).optional()
})
