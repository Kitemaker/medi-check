import { auth0 } from '@/lib/auth0';
import { connectService, revokeService, getConnectedServices } from '@/lib/token-vault';
import type { ServiceId } from '@/types';

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const services = await getConnectedServices(session.user.sub);
  return Response.json({ services });
}

export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { serviceId } = await req.json();
  await connectService(session.user.sub, serviceId as ServiceId);
  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await auth0.getSession();
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { serviceId } = await req.json();
  await revokeService(session.user.sub, serviceId as ServiceId);
  return Response.json({ success: true });
}
