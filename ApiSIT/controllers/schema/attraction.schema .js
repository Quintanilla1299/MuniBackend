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
  latitude: z.number()
    .min(-90, 'Latitude must be greater than or equal to -90')
    .max(90, 'Latitude must be less than or equal to 90'),
  longitude: z.number()
    .min(-180, 'Longitude must be greater than or equal to -180')
    .max(180, 'Longitude must be less than or equal to 180'),
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
  ).optional(),
  remarks: z.string()
    .min(1, 'Remarks are required')
    .max(255, 'Remarks must be less than 255 characters'),
  services: z.string()
    .max(255, 'Services must be less than 255 characters')
    .optional(),
  owner: z.string()
    .max(100, 'Owner name must be less than 100 characters')
    .optional(),
  community: z.string()
    .max(100, 'Community name must be less than 100 characters')
    .optional()
})
