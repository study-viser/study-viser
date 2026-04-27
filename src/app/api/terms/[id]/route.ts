import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const term = await prisma.term.findUnique({
    where: { id },
  });

  if (!term) {
    return Response.json({ error: 'Term not found' }, { status: 404 });
  }

  return Response.json(term);
}