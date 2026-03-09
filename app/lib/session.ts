'use server'

import { cookies } from 'next/headers';
import { AuthUser } from '@/types/auth';

const SESSION_COOKIE = 'session_token';
const SESSION_USER_COOKIE = 'session_user';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const userCookie = cookieStore.get(SESSION_USER_COOKIE)?.value;
  
  let user: AuthUser | null = null;
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch {
      user = null;
    }
  }
  
  return {
    token,
    user,
    isAuthenticated: !!token,
  };
}

export async function setSession(token: string, user: AuthUser) {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  
  cookieStore.set(SESSION_USER_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function removeSession() {
  const cookieStore = await cookies();
  
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(SESSION_USER_COOKIE);
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}
