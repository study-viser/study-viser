import { prisma } from '@/lib/prisma';
import MapWrapper from '@/components/MapWrapper'; // Standard import
import "./courses.css";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: { instructor: true, students: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main style={{ display: 'flex', gap: '2rem', padding: '2rem', height: '100vh' }}>
      {/* LEFT SIDE: LIST */}
      <div style={{ flex: '1', overflowY: 'auto', paddingRight: '1rem' }}>
        <h1>Courses</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {courses.map((course) => (
            <div key={course.crn} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
              <h2>{course.code}</h2>
              <p>{course.title}</p>
              <p>📍 {course.location || 'TBD'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: MAP */}
      <div style={{ flex: '1', position: 'sticky', top: '2rem', height: 'calc(100vh - 4rem)' }}>
        <MapWrapper courses={courses} />
      </div>
    </main>
  );
}