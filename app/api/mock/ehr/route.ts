import { getEhrData, validateToken } from '@/lib/services/mock-data';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!validateToken(token)) {
    return Response.json(
      { error: 'Unauthorized', message: 'Valid EHR access token required' },
      { status: 401 }
    );
  }

  return Response.json(getEhrData());
}
