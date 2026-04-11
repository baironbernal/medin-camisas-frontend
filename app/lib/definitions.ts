import * as z from 'zod'
import { AuthUser } from '@/types/auth';

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres.' })
    .trim(),
  email: z.email({ error: 'Ingresa un correo electrónico válido.' }).trim(),
  cellphone: z.string().min(10, { error: 'El celular debe tener al menos 10 dígitos.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Mínimo 8 caracteres.' })
    .regex(/[a-zA-Z]/, { error: 'Debe contener al menos una letra.' })
    .regex(/[0-9]/, { error: 'Debe contener al menos un número.' })
    .regex(/[^a-zA-Z0-9]/, { error: 'Debe contener al menos un carácter especial.' })
    .trim(),
  // Wholesaler fields — all optional
  whatsapp_number:  z.string().optional(),
  department_id:    z.coerce.number().int().positive().optional(),
  municipality_id:  z.coerce.number().int().positive().optional(),
  selling_channel:  z.string().optional(),
  clothing_type:    z.string().optional(),
  selling_location: z.string().optional(),
  business_name:    z.string().optional(),
})

export const LoginFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z.string().min(1, { error: 'Please enter your password.' }).trim(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        cellphone?: string[]
        password?: string[]
        whatsapp_number?: string[]
      }
      message?: string
      fields?: Record<string, string | undefined>
      success?: boolean
      user?: AuthUser
      redirectUrl?: string
    }
  | undefined
