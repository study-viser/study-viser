import { prisma } from '@/lib/prisma';
import TestDBTabs from '@/components/TestDBTabs';
import {
  createUser, updateUser, deleteUser,
  createCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent, getSecretCode, teachCourse,
  createTerm, updateTerm, deleteTerm, setBestSubmission,
  createSubmission, updateSubmission, deleteSubmission, reviewSubmission,
  approveSubmission, clearTermApproval, getExtraCreditByUser, getExtraCreditByCourse,
} from '@/lib/dbActions';

export const dynamic = 'force-dynamic';

const TestPage = async () => {
  const users = await prisma.user.findMany({
    include: { taughtCourses: true, enrolledCourses: true, submissions: true },
  });

  const courses = await prisma.course.findMany({
    include: { instructor: true, students: true, listing: true, terms: true },
  });

  const terms = await prisma.term.findMany({
    include: { course: true, submissions: true, bestSubmission: true },
  });

  const submissions = await prisma.submission.findMany({
    include: { creator: true, term: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main>
      <TestDBTabs
        users={users}
        courses={courses}
        terms={terms}
        submissions={submissions}
        actions={{
          createUser, updateUser, deleteUser,
          createCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent, getSecretCode, teachCourse,
          createTerm, updateTerm, deleteTerm, setBestSubmission,
          createSubmission, updateSubmission, deleteSubmission, reviewSubmission,
          approveSubmission, clearTermApproval, getExtraCreditByUser, getExtraCreditByCourse,
        }}
      />
    </main>
  );
};

export default TestPage;
