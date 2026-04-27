import StudentCourseView from '@/components/StudentCourseView';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    crn: string;
  }>;
};

export default async function StudentCoursePage({ params }: Props) {
  const { crn } = await params;

  const course = await prisma.course.findUnique({
    where: {
      crn: Number(crn),
    },
    include: {
      instructor: true,
      terms: {
        include: {
          submissions: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return <StudentCourseView course={course} />;
}