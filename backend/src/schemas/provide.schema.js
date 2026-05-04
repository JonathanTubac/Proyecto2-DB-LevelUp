import { z } from 'zod';

export const provideSchema = z.object({
  id_prov: z.number().int().positive('Proveedor inválido'),
  id_prod: z.number().int().positive('Producto inválido'),
  amount:  z.number().int().positive('La cantidad debe ser mayor a 0'),
});

export const updateProvideSchema = z.object({
  amount: z.number().int().positive('La cantidad debe ser mayor a 0'),
});