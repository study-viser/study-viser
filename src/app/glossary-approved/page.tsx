import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import ApprovedGlossaryView from '@/components/ApprovedGlossaryView';

export default async function GlossaryApprovedPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const terms = await prisma.term.findMany({
    where: {
      course: {
        students: {
          some: {
            id: userId,
          },
        },
      },
      submissions: {
        some: {
          wasReviewed: true,
          points: {
            gt: 0,
          },
        },
      },
    },
    include: {
      course: true,
      submissions: {
        where: {
          wasReviewed: true,
          points: {
            gt: 0,
          },
        },
        include: {
          creator: true,
        },
      },
    },
    orderBy: [
      {
        course: {
          code: 'asc',
        },
      },
      {
        word: 'asc',
      },
    ],
  });

    return <ApprovedGlossaryView terms={terms} mode="approved" />;
}