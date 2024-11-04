// schema/notification.schema.js
import { z } from 'zod'

export const notificationSchema = z.object({
  title: z.string().max(255),
  message: z.string().max(1000),
  user_id: z.number(),
  read: z.boolean().optional()
})
