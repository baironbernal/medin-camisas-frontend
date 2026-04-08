'use server';

import { setSession, removeSession, getAuthToken } from '../lib/session';
import { apiFetch } from './fetcher';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';
import { SignupFormSchema, FormState } from '@/app/lib/definitions';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {

   // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name:             formData.get('name'),
    email:            formData.get('email'),
    cellphone:        formData.get('cellphone'),
    password:         formData.get('password'),
    whatsapp_number:  formData.get('whatsapp_number') || undefined,
    city:             formData.get('city') || undefined,
    selling_channel:  formData.get('selling_channel') || undefined,
    clothing_type:    formData.get('clothing_type') || undefined,
    selling_location: formData.get('selling_location') || undefined,
    business_name:    formData.get('business_name') || undefined,
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      fields: {
        name:             formData.get('name') as string,
        email:            formData.get('email') as string,
        cellphone:        formData.get('cellphone') as string,
        whatsapp_number:  formData.get('whatsapp_number') as string,
        city:             formData.get('city') as string,
        selling_channel:  formData.get('selling_channel') as string,
        clothing_type:    formData.get('clothing_type') as string,
        selling_location: formData.get('selling_location') as string,
        business_name:    formData.get('business_name') as string,
      }
    }
  }

  const nameRaw = validatedFields.data.name;
  const d = validatedFields.data;
  const registerPayload = {
    name:             nameRaw,
    first_name:       nameRaw.split(' ')[0] ?? nameRaw,
    last_name:        nameRaw.split(' ').slice(1).join(' ') ?? '',
    phone_number:     d.cellphone,
    email:            d.email,
    password:         d.password,
    whatsapp_number:  d.whatsapp_number,
    city:             d.city,
    selling_channel:  d.selling_channel,
    clothing_type:    d.clothing_type,
    selling_location: d.selling_location,
    business_name:    d.business_name,
  };

  const response = await apiFetch<AuthResponse>('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerPayload),
  });

  const user = response.user;

  if (!user) {
    return {
      message: 'Ocurrió un error al crear tu cuenta. Intenta de nuevo.',
      fields: {
        name:     validatedFields.data.name,
        email:    validatedFields.data.email,
        cellphone: validatedFields.data.cellphone,
      }
    }
  }

  await setSession(response.access_token, user);
  
  const callback = formData.get('callback');
  let redirectUrl = '/';
  if (callback === 'cart') {
    redirectUrl = '/?openCart=true';
  }

  return {
    success: true,
    user,
    redirectUrl
  };
}


export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  await setSession(response.access_token, response.user!);
  return response;
}

export async function logout(): Promise<void> {
  const token = await getAuthToken();
  if (token) {
    try {
      await apiFetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Even if the request fails, clear session
    }
  }
  await removeSession();
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
