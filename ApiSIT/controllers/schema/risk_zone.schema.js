import { z } from 'zod'

export const riskZoneSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  latitude: z.coerce.number().refine(val => val >= -90 && val <= 90, {
    message: 'La latitud debe estar entre -90 y 90'
  }),
  longitude: z.coerce.number().refine(val => val >= -180 && val <= 180, {
    message: 'La longitud debe estar entre -180 y 180'
  })
})
