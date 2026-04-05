import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session?.user) redirect('/auth/login');

  return <>{children}</>;
}
