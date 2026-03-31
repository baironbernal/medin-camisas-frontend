'use server';

import { setSession, removeSession, getAuthToken } from '../lib/session';
import { apiFetch } from './fetcher';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';
import { SignupFormSchema, FormState } from '@/app/lib/definitions';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {

   // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    cellphone: formData.get('cellphone'),
    address: formData.get('address'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      fields: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        cellphone: formData.get('cellphone') as string,
        address: formData.get('address') as string,
      }
    }
  }
  
  const nameRaw = validatedFields.data.name;
  const registerPayload = {
    name: nameRaw,
    first_name: nameRaw.split(' ')[0] ?? nameRaw,
    last_name: nameRaw.split(' ').slice(1).join(' ') ?? '',
    phone_number: validatedFields.data.cellphone,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    address: validatedFields.data.address
  };

  const response = await apiFetch<AuthResponse>('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerPayload),
  });

  const user = response.user;

  if(!user) {
     return {
      message: 'An error occurred while creating your account.',
      fields: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        cellphone: validatedFields.data.cellphone,
        address: validatedFields.data.address,
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
