import StudyGuide from '@/components/StudyGuide';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ crn: string }>;
};

export default async function StudyGuidePage({ params }: Props) {
  const { crn } = await params;

  const course = await prisma.course.findUnique({
    where: { crn: Number(crn) },
    include: {
      terms: {
        include: {
          bestSubmission: {
            include: { creator: true },
          },
        },
        orderBy: [{ week: 'asc' }, { word: 'asc' }],
      },
    },
  });

  if (!course) notFound();

  return <StudyGuide course={course} />;
}
