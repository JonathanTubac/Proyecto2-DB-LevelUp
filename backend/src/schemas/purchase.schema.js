import { z } from 'zod';

export const purchaseSchema = z.object({
  tipo: z.enum(['presencial', 'en_linea'], {
    errorMap: () => ({ message: 'Tipo debe ser presencial o en_linea' })
  }),
  productos: z.array(
    z.object({
      id_producto: z.number().int().positive('ID de producto inválido'),
      cantidad:    z.number().int().positive('La cantidad debe ser mayor a 0'),
    })
  ).min(1, 'Debes enviar al menos un producto'),
});