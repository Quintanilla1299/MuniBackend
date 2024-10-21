import { z } from 'zod'

export const multimediaSchema = z.object({
  url: z.string().nonempty('El campo url es requerido').url('Debe ser una URL válida'),
  name: z.string().nonempty('El campo name es requerido'),
  title: z.string().nonempty('El campo title es requerido'),
  description: z.string().max(500, 'La descripción no debe exceder los 500 caracteres'),
  type: z.string().nonempty('El campo type es requerido')
})
