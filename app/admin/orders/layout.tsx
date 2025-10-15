import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminTokenCookieName, verifyAdminToken } from '@/lib/auth/adminAuth';

export default async function AdminOrdersLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminTokenCookieName())?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    verifyAdminToken(token);
  } catch {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
