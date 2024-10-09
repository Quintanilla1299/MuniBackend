import { z } from 'zod'

const transportInfoSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }).max(255, { message: 'El título no puede tener más de 255 caracteres' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }).max(500, { message: 'La descripción no puede tener más de 500 caracteres' }),
  type: z.enum(['Transporte Público', 'Alquiler de Vehículos', 'Bicicletas', 'Comó Llegar'], { message: 'El tipo de transporte debe ser válido' }), // Enum para validar los tipos
  website: z.string().url({ message: 'Debe ser una URL válida' }).optional(),
  phone: z.string()
    .regex(/^[+]*[(]*[0-9]{1,4}[)]*[-\s./0-9]*$/, { message: 'El número de teléfono no es válido' })
    .optional()
})

export { transportInfoSchema }
