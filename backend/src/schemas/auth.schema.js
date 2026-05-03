import { z } from 'zod';

export const loginSchema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(1, 'Password requerido'),
});

export const registerSchema = z.object({
  nombre:   z.string().min(2).max(100),
  email:    z.string().email('Correo inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número'),
  telefono: z.string().max(20).optional(),
  id_rol:   z.number().int().positive(),
});