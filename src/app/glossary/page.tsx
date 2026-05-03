import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import GlossaryView from '@/components/GlossaryView';

export default async function GlossaryPage() {
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
    },
    include: {
      course: true,
      submissions: {
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

  return <GlossaryView terms={terms} mode="all" />;
}