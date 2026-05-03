import { z } from 'zod';

export const productSchema = z.object({
  name:        z.string().min(2).max(60),
  price:       z.number().positive('El precio debe ser mayor a 0'),
  stock:       z.number().int().min(0).optional(),
  id_category: z.number().int().positive('Categoría inválida'),
});

export const updateProductSchema = productSchema.partial();