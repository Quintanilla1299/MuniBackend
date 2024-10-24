// schema/archaeologicalSite.schema.js
import { z } from 'zod'

export const archaeologicalSiteSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  latitude: z.coerce.number().refine(val => val >= -90 && val <= 90, {
    message: 'La latitud debe estar entre -90 y 90'
  }),
  longitude: z.coerce.number().refine(val => val >= -180 && val <= 180, {
    message: 'La longitud debe estar entre -180 y 180'
  }),
  image: z.string().nullable().optional()
})
