import { prisma } from '@/lib/prisma';
import TestDBTabs from '@/components/TestDBTabs';

/** Fetch all data server-side and pass to client tabs component. */
const TestPage = async () => {

  const users = await prisma.user.findMany({
    include: {
      taughtCourses: true,
      enrolledCourses: true,
      submissions: true,
    },
  });

  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
      students: true,
      listing: true,
      terms: true,
    },
  });

  const terms = await prisma.term.findMany({
    include: {
      course: true,
      submissions: true,
      bestSubmission: true,
    },
  });

  const submissions = await prisma.submission.findMany({
    include: {
      creator: true,
      term: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main>
      <TestDBTabs
        users={users}
        courses={courses}
        terms={terms}
        submissions={submissions}
      />
    </main>
  );
};

export default TestPage;
