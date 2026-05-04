import { prisma } from '@/lib/prisma';
import MapWrapper from '@/components/MapWrapper'; // Standard import
import "./courses.css";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: { instructor: true, students: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="courses-page" style={{ display: 'flex', gap: '2rem' }}>
      
      {/* LEFT SIDE: LIST */}
      <div className="courses-container" style={{ flex: 1, overflowY: 'auto' }}>
        <h1 className="courses-title">Courses</h1>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.crn} className="courses-card">
              <h2 className="courses-code">{course.code}</h2>
              <p className="courses-course-title">{course.title}</p>
              <p className="courses-meta">📍 {course.location || 'TBD'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: MAP */}
      <div className="courses-map">
        <MapWrapper courses={courses} />
      </div>

    </main>
  );
}