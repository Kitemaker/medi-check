import { auth0 } from '@/lib/auth0';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const user = session!.user;

  return <DashboardClient user={user} />;
}
