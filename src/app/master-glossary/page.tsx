import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import MasterGlossaryView from '@/components/MasterGlossaryView';

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
      bestSubmissionId: { not: null },
    },
    include: {
      course: true,
      bestSubmission: true,
    },
    orderBy: { word: 'asc' },
  });

  return <MasterGlossaryView terms={terms} />;
}
