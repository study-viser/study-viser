import StudentCourseView from '@/components/StudentCourseView';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';

type Props = {
  params: Promise<{
    crn: string;
  }>;
};

export default async function StudentCoursePage({ params }: Props) {
  const session = await auth();
  const { crn } = await params;

  const course = await prisma.course.findUnique({
    where: {
      crn: Number(crn),
    },
    include: {
      instructor: true,
      terms: {
        include: {
          submissions: {
            include: {
              creator: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return <StudentCourseView course={course} userId={session?.user?.id} />;
}