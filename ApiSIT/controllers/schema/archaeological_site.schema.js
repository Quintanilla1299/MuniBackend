// schema/archaeologicalSite.schema.js
import { z } from 'zod'

export const archaeologicalSiteSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  latitude: z.number().min(-90).max(90, 'Latitud no válida'),
  longitude: z.number().min(-180).max(180, 'Longitud no válida'),
  image: z.string().nullable().optional()
})
