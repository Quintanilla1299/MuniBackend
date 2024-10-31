import { z } from 'zod'

const travelDestinationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  bestTimeToVisit: z.string().min(1, 'Best time to visit is required'),
  travelTips: z.string().min(1, 'Travel tips are required'),
  latitude: z.coerce.number().refine(val => val >= -90 && val <= 90, {
    message: 'La latitud debe estar entre -90 y 90'
  }),
  longitude: z.coerce.number().refine(val => val >= -180 && val <= 180, {
    message: 'La longitud debe estar entre -180 y 180'
  })
})

export { travelDestinationSchema }
