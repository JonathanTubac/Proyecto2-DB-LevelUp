import { z } from 'zod';

export const walletAmountSchema = z.object({
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(10000, 'Monto máximo: Q10,000'),
});