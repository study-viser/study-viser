import TermView from '@/components/TermView';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    crn: string;
    termId: string;
  }>;
};

export default async function TermPage({ params }: Props) {
  const { crn, termId } = await params;

  const term = await prisma.term.findUnique({
    where: { id: termId },
    include: {
      course: true,
      bestSubmission: {
        include: {
          creator: true,
        },
      },
      submissions: {
        include: {
          creator: true,
        },
      },
    },
  });

  if (!term || term.courseCRN !== Number(crn)) {
    notFound();
  }

  return <TermView term={term} crn={Number(crn)} />;
}