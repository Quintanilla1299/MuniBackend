import { z } from 'zod'

export const accessibilitySchema = z.object({
  attraction_id: z.number().int().positive(),
  ramp_access: z.boolean().optional(),
  elevator_access: z.boolean().optional(),
  wide_doors: z.boolean().optional(),
  braille_signage: z.boolean().optional(),
  accessible_bathrooms: z.boolean().optional(),
  reserved_parking: z.boolean().optional(),
  trained_staff: z.boolean().optional(),
  audio_guides: z.boolean().optional(),
  sign_language_services: z.boolean().optional(),
  accessible_rest_areas: z.boolean().optional(),
  online_accessibility: z.boolean().optional(),
  other_services: z.string().max(255, 'Other services description must be less than 255 characters').optional()
})
