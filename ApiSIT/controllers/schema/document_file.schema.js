import { z } from 'zod'

// Esquema de validación Zod para DocumentFile
export const documentFileSchema = z.object({
  filename: z.string()
    .min(1, 'El nombre del archivo es requerido')
    .max(255, 'El nombre del archivo debe tener menos de 255 caracteres'),

  filePath: z.string()
    .min(1, 'La ruta del archivo es requerida')
    .max(500, 'La ruta del archivo debe tener menos de 500 caracteres'),

  fileType: z.string()
    .min(1, 'El tipo de archivo es requerido')
    .max(50, 'El tipo de archivo debe tener menos de 50 caracteres')
    .regex(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/, 'Solo se permiten archivos PDF, Word, Excel o PowerPoint'),

  fileSize: z.number()
    .positive('El tamaño del archivo debe ser un número positivo')
    .max(10000000, 'El tamaño del archivo debe ser menor a 10MB'), // 10MB como ejemplo de límite

  entity_id: z.number()
    .positive('El ID de la entidad debe ser un número positivo')
})
