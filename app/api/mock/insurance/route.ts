import { getInsuranceCoverage, validateToken } from '@/lib/services/mock-data';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!validateToken(token)) {
    return Response.json(
      { error: 'Unauthorized', message: 'Valid insurance access token required' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const procedure = searchParams.get('procedure') ?? 'general';
  const specialist = searchParams.get('specialist') ?? undefined;

  return Response.json(getInsuranceCoverage(procedure, specialist));
}
