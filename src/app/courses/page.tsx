import { prisma } from '@/lib/prisma';
import "./courses.css";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      instructor: true,   // include instructor info
      students: true,     // optional: shows student count
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Courses</h1>

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.crn} style={{ marginBottom: '1.5rem' }}>
              <h2>{course.code} - {course.title}</h2>

              {course.description && <p>{course.description}</p>}

              <p><strong>CRN:</strong> {course.crn}</p>

              <p>
                <strong>Instructor:</strong>{' '}
                {course.instructor
                  ? course.instructor.name
                  : 'Not assigned'}
              </p>

              <p>
                <strong>Students enrolled:</strong>{' '}
                {course.students.length}
              </p>

              {course.location && (
                <p><strong>Location:</strong> {course.location}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}