import { getAvailableSlots, bookAppointment, validateToken } from '@/lib/services/mock-data';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!validateToken(token)) {
    return Response.json(
      { error: 'Unauthorized', message: 'Valid calendar access token required' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get('specialty') ?? undefined;

  return Response.json({ slots: getAvailableSlots(specialty) });
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!validateToken(token)) {
    return Response.json(
      { error: 'Unauthorized', message: 'Valid calendar access token required' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const appointment = bookAppointment(body.slotIndex ?? 0, body.reason ?? 'General consultation');

  return Response.json({ appointment, success: true }, { status: 201 });
}
