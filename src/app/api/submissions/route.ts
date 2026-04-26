import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Not logged in' }, { status: 401 });
  }

  const body = await req.json();

  if (!body.termId || !body.definition) {
    return Response.json({ error: 'Missing term or definition' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  //check if user already submitted a definition for this term
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      creatorId: user.id,
      termId: body.termId,
    },
  });

  if (existingSubmission) {
    return Response.json(
      { error: 'You already submitted a definition for this term.' },
      { status: 400 },
    );
  }

  //create submision after checking all conditions
  const submission = await prisma.submission.create({
    data: {
      creatorId: user.id,
      termId: body.termId,
      definition: body.definition,
      wasReviewed: false,
      points: 0,
    },
  });

  return Response.json(submission);
}