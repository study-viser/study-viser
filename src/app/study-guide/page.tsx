import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';
import '@/styles/student-course.css';

export default async function StudyGuidePage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? '',
    },
    include: {
      enrolledCourses: true,
    },
  });

  const courses = user?.enrolledCourses ?? [];

  return (
    <main className="progress-page">
      <BackButton />

      <section className="progress-header">
        <p className="progress-eyebrow">Study Mode</p>
        <h1>Study Guide</h1>
        <p>Select a course to open its study guide.</p>
      </section>

      <section className="progress-section">
        {courses.length === 0 ? (
          <p>No enrolled courses yet.</p>
        ) : (
          <div className="term-grid">
            {courses.map((course) => (
              <Link
                key={course.crn}
                href={`/student-course/${course.crn}/study-guide`}
                className="term-card study-course-card"
              >

                <h3 className="term-name">{course.code}</h3>
                <p className="official-definition">{course.title}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}