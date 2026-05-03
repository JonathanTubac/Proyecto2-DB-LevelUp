import { z } from 'zod';

export const providerSchema = z.object({
  name: z.string().min(2).max(60),
});