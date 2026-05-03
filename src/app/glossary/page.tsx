import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import ApprovedGlossaryView from '@/components/ApprovedGlossaryView';

export default async function GlossaryPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const terms = await prisma.term.findMany({
    where: {
      course: {
        OR: [
          { students: { some: { id: userId } } },
          { instructorId: userId },
        ],
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
      { course: { code: 'asc' } },
      { week: 'asc' },
      { word: 'asc' },
    ],
  });

  return <ApprovedGlossaryView terms={terms} mode="all" />;
}